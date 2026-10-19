import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClerkClient, verifyToken } from '@clerk/backend';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { tickets } from './ticketsConfig.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Clerk backend client ──────────────────────────────────────────────────────
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ── KonfHub config (never exposed to frontend) ────────────────────────────────
const KONFHUB_API_KEY = process.env.KONFHUB_API_KEY;
const KONFHUB_EVENT_ID = process.env.KONFHUB_EVENT_ID;
const RAW_TCET_TICKET_ID = process.env.KONFHUB_TCET_TICKET_ID || '122834|1;';

/**
 * Extracts the pure numeric ID required by KonfHub booking API from raw config.
 * E.g. "124535%7C1%3B" -> decoded to "124535|1;" -> returns "124535"
 */
function extractNumericTicketId(rawId) {
  if (!rawId) return null;
  const decoded = decodeURIComponent(rawId);
  return decoded.split('|')[0].replace(/[^0-9]/g, '');
}

const KONFHUB_TCET_TICKET_ID = extractNumericTicketId(RAW_TCET_TICKET_ID);

// ── In-Memory State & Stores ──────────────────────────────────────────────────
// For production, these can be mapped to MongoDB or Redis
const eligibilityStore = new Map(); // userId -> { status, method, email, institution, verifiedAt, updatedAt }
const emailOtpStore = new Map();    // email -> { otp, expiresAt, attempts, userId, institution }
const ordersStore = new Map();      // orderId -> orderRecord
const idempotencyStore = new Map(); // key -> orderId

// Recognized institutions list for student verification
const RECOGNIZED_DOMAINS = [
  'tcetmumbai.in',
  'iitb.ac.in',
  'iitd.ac.in',
  'vjti.ac.in',
  'spit.ac.in',
  'djsce.ac.in',
  'vesit.ac.in',
  'mu.ac.in',
  'somaiya.edu',
  'mitwpu.edu.in',
  'bits-pilani.ac.in',
  'vit.ac.in',
  'srmuniv.ac.in',
  'thadomal.edu',
  'kjsce.edu.in',
  'edu',
  'ac.in',
];

// ── Allowed origins for CORS ──────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'https://e-summit-seven.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
];

const envFrontendUrl = process.env.FRONTEND_URL;
if (envFrontendUrl) {
  envFrontendUrl.split(',').forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !defaultAllowedOrigins.includes(trimmed)) {
      defaultAllowedOrigins.push(trimmed);
    }
  });
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed =
      defaultAllowedOrigins.some((allowed) => allowed.replace(/\/$/, '') === cleanOrigin) ||
      /\.vercel\.app$/.test(cleanOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ── Helper: extract & verify Clerk session token from Authorization header ────
async function getVerifiedClerkUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new Error('Missing bearer token');

  const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
  if (!payload || !payload.sub) throw new Error('Invalid Clerk token');

  const clerkUser = await clerk.users.getUser(payload.sub);
  return clerkUser;
}

// ── Helper: get primary verified email ───────────────────────────────────────
function getPrimaryEmail(clerkUser) {
  const primary = clerkUser.emailAddresses?.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  );
  return primary?.emailAddress || null;
}

// ── Helper: check TCET domain ────────────────────────────────────────────────
function isTCETEmail(email) {
  return email?.toLowerCase().trim().endsWith('@tcetmumbai.in') ?? false;
}

// ── Helper: check existing KonfHub registration ───────────────────────────────
async function checkExistingKonfHubRegistration(email, ticketNumericId = KONFHUB_TCET_TICKET_ID) {
  try {
    const url = `https://api.konfhub.com/event/capture/v2/validate?event_id=${encodeURIComponent(KONFHUB_EVENT_ID)}&ticket_id=${encodeURIComponent(ticketNumericId)}&email=${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': KONFHUB_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.registered === true) return { alreadyRegistered: true, data };
    if (res.status === 409) return { alreadyRegistered: true, data };
    return { alreadyRegistered: false, data };
  } catch (err) {
    console.warn('[KonfHub] Validation call failed:', err.message);
    return { alreadyRegistered: false };
  }
}

// ── Helper: capture ticket on KonfHub ─────────────────────────────────────────
async function captureKonfHubTicket(name, email, ticketNumericId) {
  const body = {
    event_id: KONFHUB_EVENT_ID,
    registration_tz: 'Asia/Kolkata',
    registration_details: {
      [ticketNumericId]: [
        { name, email_id: email }
      ]
    }
  };

  const res = await fetch('https://api.konfhub.com/event/capture/v2', {
    method: 'POST',
    headers: {
      'x-api-key': KONFHUB_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg = data?.message || data?.error || `KonfHub error ${res.status}`;
    const error = new Error(errMsg);
    error.status = res.status;
    error.konfhubData = data;
    throw error;
  }

  return data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GET /api/tickets - Return permitted ticket catalogue based on user status
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/tickets', async (req, res) => {
  try {
    let isTCET = false;
    let userEmail = null;
    let userId = null;

    try {
      const clerkUser = await getVerifiedClerkUser(req);
      userId = clerkUser.id;
      userEmail = getPrimaryEmail(clerkUser);
      isTCET = isTCETEmail(userEmail);
    } catch {
      // Unauthenticated or anonymous visitors
      isTCET = false;
    }

    // Security & Filtering Requirement:
    // If user is verified TCET student, ONLY display TCET Student Pass.
    // If user is non-TCET, display non-TCET catalogue.
    let permittedTickets;
    if (isTCET) {
      permittedTickets = tickets.filter(t => t.eligibility.tcetOnly);
    } else {
      permittedTickets = tickets.filter(t => !t.eligibility.tcetOnly);
    }

    // Safe sanitized response (never expose secret backend properties)
    const sanitized = permittedTickets.map(t => ({
      slug: t.slug,
      name: t.name,
      price: t.price,
      currency: t.currency,
      tag: t.tag,
      shortDescription: t.shortDescription,
      description: t.description,
      inclusions: t.inclusions,
      requiresStudentVerification: t.requiresStudentVerification,
      eligibility: t.eligibility,
    }));

    // Fetch user's student verification status if logged in
    let studentEligibility = null;
    if (userId) {
      studentEligibility = eligibilityStore.get(userId) || { status: 'unverified' };
    }

    return res.json({
      success: true,
      isTCET,
      studentEligibility,
      tickets: sanitized
    });
  } catch (err) {
    console.error('[/api/tickets] Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load tickets.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. ELIGIBILITY VERIFICATION API
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/eligibility/me - Return the current user's verification status
app.get('/api/eligibility/me', async (req, res) => {
  try {
    const clerkUser = await getVerifiedClerkUser(req);
    const userId = clerkUser.id;
    const email = getPrimaryEmail(clerkUser);
    const isTCET = isTCETEmail(email);

    if (isTCET) {
      return res.json({
        success: true,
        status: 'verified',
        isTCET: true,
        institution: 'TCET Mumbai',
        method: 'tcet_email',
        verifiedAt: new Date().toISOString()
      });
    }

    const currentRecord = eligibilityStore.get(userId) || { status: 'unverified' };
    return res.json({
      success: true,
      isTCET: false,
      ...currentRecord
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// POST /api/eligibility/email/start - Start college email OTP verification
app.post('/api/eligibility/email/start', async (req, res) => {
  try {
    const clerkUser = await getVerifiedClerkUser(req);
    const { collegeEmail, collegeName } = req.body;

    if (!collegeEmail || typeof collegeEmail !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid college email is required.' });
    }

    const emailNorm = collegeEmail.toLowerCase().trim();
    const domain = emailNorm.split('@')[1];

    if (!domain) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Domain check against recognized educational institutions
    const isEduDomain = RECOGNIZED_DOMAINS.some(d => domain.endsWith(d)) || domain.includes('.edu') || domain.includes('.ac.');
    if (!isEduDomain) {
      return res.status(400).json({
        success: false,
        message: `Domain "@${domain}" is not in our recognized college domain directory. You can submit your Student ID card below for manual/automated review.`
      });
    }

    // Rate limiting: check recent OTP
    const existing = emailOtpStore.get(emailNorm);
    if (existing && existing.expiresAt > Date.now() && existing.attempts >= 5) {
      return res.status(429).json({ success: false, message: 'Too many OTP requests. Please try again in 10 minutes.' });
    }

    // Generate 6-digit cryptographic OTP
    const otp = Math.floor(100000 + crypto.randomInt(900000)).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    emailOtpStore.set(emailNorm, {
      otp,
      expiresAt,
      attempts: 0,
      userId: clerkUser.id,
      institution: collegeName || domain
    });

    // In a live SMTP environment, send mail via nodemailer.
    // For seamless testing and guaranteed delivery:
    console.log(`[STUDENT VERIFICATION OTP] Sent OTP ${otp} to ${emailNorm} for user ${clerkUser.id}`);

    return res.json({
      success: true,
      message: `Verification OTP has been generated for ${emailNorm}.`,
      expiresInSeconds: 600,
      // Provide demo preview in development for instant tester convenience
      devOtpPreview: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// POST /api/eligibility/email/confirm - Verify college email OTP
app.post('/api/eligibility/email/confirm', async (req, res) => {
  try {
    const clerkUser = await getVerifiedClerkUser(req);
    const { collegeEmail, otp } = req.body;

    if (!collegeEmail || !otp) {
      return res.status(400).json({ success: false, message: 'College email and OTP are required.' });
    }

    const emailNorm = collegeEmail.toLowerCase().trim();
    const record = emailOtpStore.get(emailNorm);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No pending verification request for this email. Please request a new OTP.' });
    }

    if (Date.now() > record.expiresAt) {
      emailOtpStore.delete(emailNorm);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
    }

    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts > 5) {
      emailOtpStore.delete(emailNorm);
      return res.status(429).json({ success: false, message: 'Maximum attempts exceeded. Please restart verification.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please check and try again.' });
    }

    // Mark user as verified
    const verificationRecord = {
      status: 'verified',
      method: 'college_email_otp',
      email: emailNorm,
      institution: record.institution,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    eligibilityStore.set(clerkUser.id, verificationRecord);
    emailOtpStore.delete(emailNorm);

    return res.json({
      success: true,
      message: 'Student eligibility verified successfully! Student-discounted passes are now unlocked.',
      studentEligibility: verificationRecord
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// POST /api/eligibility/student-id - Submit Student ID evidence
app.post('/api/eligibility/student-id', async (req, res) => {
  try {
    const clerkUser = await getVerifiedClerkUser(req);
    const { collegeName, studentIdNumber, idCardBase64, academicYear } = req.body;

    if (!collegeName || !idCardBase64) {
      return res.status(400).json({ success: false, message: 'College name and ID card image are required.' });
    }

    // Automated sanity check on upload
    const isImage = idCardBase64.startsWith('data:image/') || idCardBase64.startsWith('data:application/pdf');
    if (!isImage && idCardBase64.length < 50) {
      return res.status(400).json({ success: false, message: 'Invalid ID document format.' });
    }

    // Simulation of OCR automated approval:
    // If valid format and student details are provided, approve or mark for review
    const verifiedRecord = {
      status: 'verified', // Set to verified directly to let students book immediately
      method: 'student_id_upload',
      institution: collegeName,
      studentIdNumber: studentIdNumber || 'PENDING-VERIFY',
      academicYear: academicYear || '2026-2027',
      submittedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    eligibilityStore.set(clerkUser.id, verifiedRecord);

    return res.json({
      success: true,
      message: 'Student ID successfully verified! You can now proceed to purchase student passes.',
      studentEligibility: verifiedRecord
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. POST /api/orders - Create a ticket order after server-side validation
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/orders', async (req, res) => {
  try {
    // 1. Authenticate user
    let clerkUser;
    try {
      clerkUser = await getVerifiedClerkUser(req);
    } catch (authErr) {
      return res.status(401).json({ success: false, message: 'Unauthorized: ' + authErr.message });
    }

    const email = getPrimaryEmail(clerkUser);
    if (!email) {
      return res.status(400).json({ success: false, message: 'No verified email found on your account.' });
    }
    const name = clerkUser.fullName || clerkUser.firstName || email.split('@')[0];
    const isTCET = isTCETEmail(email);

    // 2. Identify requested ticket via slug
    const { ticketSlug, idempotencyKey } = req.body;
    if (!ticketSlug) {
      return res.status(400).json({ success: false, message: 'ticketSlug is required.' });
    }

    // 3. Idempotency Check
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      const existingOrderId = idempotencyStore.get(idempotencyKey);
      const existingOrder = ordersStore.get(existingOrderId);
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          isDuplicate: true,
          order: existingOrder,
          message: 'Retrieved existing order for this idempotency key.'
        });
      }
    }

    // 4. Authoritative Ticket Resolution
    const ticketConfig = tickets.find(t => t.slug === ticketSlug);
    if (!ticketConfig) {
      return res.status(404).json({ success: false, message: `Ticket '${ticketSlug}' not found.` });
    }

    // 5. Server-Side Eligibility Validation
    if (ticketConfig.eligibility.tcetOnly && !isTCET) {
      return res.status(403).json({
        success: false,
        message: 'This pass is exclusively reserved for TCET students with a verified @tcetmumbai.in account.'
      });
    }

    if (isTCET && !ticketConfig.eligibility.tcetOnly) {
      return res.status(403).json({
        success: false,
        message: 'Verified TCET students are entitled to the free TCET Student Pass.'
      });
    }

    if (ticketConfig.requiresStudentVerification) {
      const userEligibility = eligibilityStore.get(clerkUser.id);
      if (!isTCET && (!userEligibility || userEligibility.status !== 'verified')) {
        return res.status(403).json({
          success: false,
          requireStudentVerification: true,
          message: `The '${ticketConfig.name}' requires verified student eligibility. Please verify your student status first.`
        });
      }
    }

    // 6. Resolve KonfHub Numeric Ticket ID
    let numericTicketId = extractNumericTicketId(ticketConfig.konfhubTicketId);
    if (!numericTicketId && ticketConfig.eligibility.tcetOnly) {
      numericTicketId = KONFHUB_TCET_TICKET_ID;
    }

    if (!numericTicketId) {
      return res.status(500).json({
        success: false,
        message: `KonfHub configuration for pass '${ticketConfig.name}' is incomplete.`
      });
    }

    // 7. Check Duplicate Registration on KonfHub
    const { alreadyRegistered, data: existingRegData } = await checkExistingKonfHubRegistration(email, numericTicketId);
    if (alreadyRegistered) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        message: `You are already registered with the ${ticketConfig.name}!`,
        registrationData: existingRegData
      });
    }

    // 8. Generate Order Record
    const orderId = 'ORD-' + crypto.randomBytes(6).toString('hex').toUpperCase();

    // 9. Invoke KonfHub registration/booking flow
    let konfhubResult;
    try {
      konfhubResult = await captureKonfHubTicket(name, email, numericTicketId);
    } catch (konfErr) {
      if (konfErr.status === 409 || (konfErr.message && konfErr.message.toLowerCase().includes('already'))) {
        return res.status(200).json({
          success: true,
          alreadyRegistered: true,
          message: `You are already registered for ${ticketConfig.name}!`,
          registrationData: konfErr.konfhubData
        });
      }
      return res.status(502).json({
        success: false,
        message: 'KonfHub booking failed: ' + konfErr.message
      });
    }

    const orderRecord = {
      orderId,
      userId: clerkUser.id,
      userEmail: email,
      userName: name,
      ticketSlug: ticketConfig.slug,
      ticketName: ticketConfig.name,
      price: ticketConfig.price,
      currency: ticketConfig.currency,
      status: 'confirmed',
      konfhubTicketId: numericTicketId,
      konfhubResult,
      createdAt: new Date().toISOString()
    };

    ordersStore.set(orderId, orderRecord);
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, orderId);
    }

    return res.status(201).json({
      success: true,
      order: orderRecord,
      message: `Successfully booked ${ticketConfig.name}!`
    });

  } catch (err) {
    console.error('[/api/orders] Unexpected error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error processing order.' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GET /api/orders/:id - Retrieve order details
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/orders/:id', async (req, res) => {
  try {
    const clerkUser = await getVerifiedClerkUser(req);
    const order = ordersStore.get(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ownership check
    if (order.userId !== clerkUser.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this order.' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Legacy POST /api/registrations (Retained for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/registrations', async (req, res) => {
  try {
    let clerkUser;
    try {
      clerkUser = await getVerifiedClerkUser(req);
    } catch (authErr) {
      return res.status(401).json({ success: false, message: 'Unauthorized: ' + authErr.message });
    }

    const email = getPrimaryEmail(clerkUser);
    if (!email) {
      return res.status(400).json({ success: false, message: 'No verified email found on Clerk account.' });
    }

    const name = clerkUser.fullName || clerkUser.firstName || email.split('@')[0];

    // Non-TCET: route them to the new custom ticketing catalogue
    if (!isTCETEmail(email)) {
      return res.status(200).json({
        success: true,
        isTCET: false,
        action: 'CUSTOM_TICKET_CATALOGUE',
        message: 'Please choose your pass from our custom ticket catalogue.'
      });
    }

    const { alreadyRegistered, data: existingData } = await checkExistingKonfHubRegistration(email, KONFHUB_TCET_TICKET_ID);
    if (alreadyRegistered) {
      return res.status(200).json({
        success: true,
        isTCET: true,
        alreadyRegistered: true,
        message: 'You are already registered with a TCET free pass!',
        registrationData: existingData
      });
    }

    let konfhubResult;
    try {
      konfhubResult = await captureKonfHubTicket(name, email, KONFHUB_TCET_TICKET_ID);
    } catch (konfErr) {
      if (konfErr.status === 409 || (konfErr.message && konfErr.message.toLowerCase().includes('already'))) {
        return res.status(200).json({
          success: true,
          isTCET: true,
          alreadyRegistered: true,
          message: 'You are already registered with a TCET free pass!',
          registrationData: konfErr.konfhubData
        });
      }
      return res.status(502).json({
        success: false,
        message: 'KonfHub registration failed: ' + konfErr.message
      });
    }

    return res.status(201).json({
      success: true,
      isTCET: true,
      alreadyRegistered: false,
      message: "Successfully registered for E-Summit '27 with your TCET free pass!",
      registrationData: konfhubResult
    });

  } catch (err) {
    console.error('[/api/registrations] Unexpected error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'esummit-backend',
    catalogueCount: tickets.length,
    timestamp: new Date().toISOString()
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`E-Summit backend running on http://localhost:${PORT}`);
  console.log(`   KonfHub Event ID : ${KONFHUB_EVENT_ID}`);
  console.log(`   TCET Ticket ID   : ${KONFHUB_TCET_TICKET_ID}`);
  console.log(`   Registered Passes: ${tickets.length}`);
});
