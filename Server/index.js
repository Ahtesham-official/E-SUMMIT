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

// ── Groq OCR & AI Verification Config ─────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_OCR_MODEL = process.env.GROQ_OCR_MODEL || 'qwen/qwen3.8-27b';

// ── Admin Credentials ─────────────────────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@esummit.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2027';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Simple admin JWT token generation & verification (no external dep needed)
function generateAdminToken(email) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyAdminToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', ADMIN_JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

// Admin auth middleware
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication required.' });
  }
  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token.' });
  }
  req.adminUser = decoded;
  next();
}

// ── In-Memory State & Stores ──────────────────────────────────────────────────
// For production, these can be mapped to MongoDB or Redis
const eligibilityStore = new Map(); // userId -> { status, method, email, institution, verifiedAt, updatedAt }
const emailOtpStore = new Map();    // email -> { otp, expiresAt, attempts, userId, institution }
const ordersStore = new Map();      // orderId -> orderRecord
const idempotencyStore = new Map(); // key -> orderId
const pendingVerificationsStore = new Map(); // verificationId -> verificationRecord

// Allowed educational domains checklist for student verification OTP
const ALLOWED_EMAIL_DOMAINS = [
  'tcetmumbai.in',
  'iitb.ac.in',
  'iitd.ac.in',
  'iitk.ac.in',
  'iitm.ac.in',
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
  'coep.ac.in',
  'pict.edu',
];

// Helper to verify if domain is in checklist
function isDomainAllowed(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some(allowed => d === allowed || d.endsWith('.' + allowed));
}

// ── Allowed origins for CORS ──────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'https://e-summit-seven.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
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

  const payload = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
    clockSkewInMs: 60 * 1000 // 60s leeway for clock drift
  });
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

// ── Helper: Groq OCR & AI Generation Detection ─────────────────────────────────
async function analyzeStudentIdWithGroq(idCardBase64, expectedCollege, expectedId) {
  if (!GROQ_API_KEY) {
    return {
      success: false,
      isSuspicious: true,
      reason: 'No Groq API key configured on server. Requires manual review.',
      error: 'NO_GROQ_API_KEY'
    };
  }

  // Ensure base64 data URI format - strip and rebuild if needed
  let imageUrl = idCardBase64;
  if (imageUrl.startsWith('data:')) {
    // Already a data URI, keep as-is
  } else {
    // Raw base64 string, prepend the data URI prefix
    imageUrl = `data:image/jpeg;base64,${imageUrl}`;
  }

  // Extract just the base64 portion for size validation
  const base64Data = imageUrl.split(',')[1] || imageUrl;
  const estimatedSizeBytes = Math.ceil(base64Data.length * 3 / 4);
  
  // Groq has a ~20MB payload limit; if image is too large, resize note
  if (estimatedSizeBytes > 15 * 1024 * 1024) {
    return {
      success: false,
      isSuspicious: true,
      reason: 'Image file is too large for automated OCR analysis. Sent for manual review.',
      error: 'IMAGE_TOO_LARGE'
    };
  }

  const prompt = `You are an automated forensic document analyst for a university conference.
Analyze this uploaded student ID card image carefully.

Tasks:
1. OCR extraction: Extract visible institution/college name, student ID number, student name, and expiration/academic year from the card.
2. AI-Generation & Fraud Detection: Look for signs that this is an AI-generated image (e.g. Midjourney/Stable Diffusion/DALL-E artifacts, nonsensical text, inconsistent typography, distorted logos, unrealistic textures, warped borders, unnatural hands/faces, synthetic lighting).
3. Classification & Confidence Scoring:
   - "genuine": Clear, authentic student ID card with readable college and student details (confidence score: 0.75 - 1.00).
   - "suspicious": Borderline, blurry, questionable edits, mismatch in college/ID, or possible AI-generated features (confidence score: 0.40 - 0.74).
   - "spam": Totally unrelated image (selfie, scenery, random photo, meme, blank, advertisement, or obvious fake) that is NOT a student ID card (confidence score: 0.00 - 0.39).

Expected college (if provided): ${expectedCollege || 'Not specified'}
Expected student ID (if provided): ${expectedId || 'Not specified'}

Respond strictly in valid JSON format only. No markdown, no code fences, no explanation outside JSON:
{
  "isAuthentic": true,
  "isAiGenerated": false,
  "isSuspicious": false,
  "confidenceScore": 0.85,
  "tag": "genuine",
  "detectedInstitution": "Name of college/university visible on card",
  "detectedStudentId": "ID number visible on card",
  "detectedStudentName": "Name visible on card",
  "suspicionReasons": [],
  "summary": "Brief summary of analysis"
}`;

  try {
    const requestBody = {
      model: GROQ_OCR_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { 
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 800
    };

    console.log(`[Groq OCR] Sending analysis request using model: ${GROQ_OCR_MODEL}`);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || `Groq API responded with status ${response.status}`;
      console.warn('[Groq OCR] API Error:', errMsg, JSON.stringify(data?.error || {}));

      return {
        success: false,
        isSuspicious: true,
        tag: 'suspicious',
        confidenceScore: 0.45,
        reason: `OCR service error (${response.status}): ${errMsg}. Sent for manual verification.`,
        error: errMsg
      };
    }

    const content = data?.choices?.[0]?.message?.content || '{}';
    let parsed;
    try {
      // Strip markdown code fences if the model wraps output in ```json ... ```
      const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[Groq OCR] Failed to parse JSON response, treating as text:', content.substring(0, 200));
      parsed = {
        isAuthentic: true,
        isAiGenerated: false,
        isSuspicious: false,
        confidenceScore: 0.5,
        tag: 'suspicious',
        summary: content
      };
    }

    // Determine normalized confidence score (0 to 1)
    let score = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.5;
    if (score > 1 && score <= 100) score = score / 100; // normalize percentage if returned as 85 instead of 0.85
    score = Math.max(0, Math.min(1, score));

    // Derive or sanitize tag: 'genuine' | 'suspicious' | 'spam'
    let tag = (parsed.tag || '').toLowerCase().trim();
    if (!['genuine', 'suspicious', 'spam'].includes(tag)) {
      if (parsed.isAiGenerated || score < 0.4) {
        tag = 'spam';
      } else if (!parsed.isAuthentic || parsed.isSuspicious || score < 0.75) {
        tag = 'suspicious';
      } else {
        tag = 'genuine';
      }
    }

    // If marked genuine but score is low or marked AI-generated, override safely
    if (tag === 'genuine' && (parsed.isAiGenerated || score < 0.6)) {
      tag = 'suspicious';
    }

    parsed.confidenceScore = score;
    parsed.tag = tag;

    const isSuspicious = tag !== 'genuine';

    console.log(`[Groq OCR] Analysis complete - Tag: ${tag.toUpperCase()}, Score: ${(score * 100).toFixed(0)}%, Authentic: ${parsed.isAuthentic}, AI Generated: ${parsed.isAiGenerated}`);

    return {
      success: true,
      tag,
      confidenceScore: score,
      isSuspicious,
      analysis: parsed,
      reason: isSuspicious ? (parsed.suspicionReasons?.join(', ') || `Flagged as ${tag} with ${(score * 100).toFixed(0)}% confidence score.`) : 'Verified authentic by Groq OCR'
    };
  } catch (networkErr) {
    console.error('[Groq OCR] Network/Fetch exception:', networkErr);
    return {
      success: false,
      isSuspicious: true,
      tag: 'suspicious',
      confidenceScore: 0.3,
      reason: `Groq OCR unreachable: ${networkErr.message}. Sent for manual verification.`,
      error: networkErr.message
    };
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
    let errMsg = `KonfHub error ${res.status}`;
    if (typeof data?.error === 'string') {
      errMsg = data.error;
    } else if (data?.error?.error_message) {
      errMsg = data.error.error_message;
    } else if (typeof data?.message === 'string') {
      errMsg = data.message;
    }
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
      originalPrice: t.originalPrice,
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

    // Domain check against recognized educational institutions checklist array
    if (!isDomainAllowed(domain)) {
      return res.status(400).json({
        success: false,
        message: `The domain "@${domain}" is not in our approved student institutions checklist. Please use your official college email or upload your student ID card for verification.`
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

    const email = getPrimaryEmail(clerkUser) || 'unknown@domain.com';
    const userName = clerkUser.fullName || clerkUser.firstName || email.split('@')[0];
    const verificationId = 'VER-' + crypto.randomBytes(5).toString('hex').toUpperCase();

    // Run Groq Multimodal OCR & AI Document Forensic Model
    const ocrResult = await analyzeStudentIdWithGroq(idCardBase64, collegeName, studentIdNumber);
    const tag = ocrResult.tag || (ocrResult.isSuspicious ? 'suspicious' : 'genuine');
    const confidenceScore = typeof ocrResult.confidenceScore === 'number' ? ocrResult.confidenceScore : 0.5;

    if (ocrResult.isSuspicious) {
      // Flagged as suspicious or spam -> Needs manual admin review
      const pendingRecord = {
        verificationId,
        userId: clerkUser.id,
        userEmail: email,
        userName,
        institution: collegeName,
        studentIdNumber: studentIdNumber || 'NOT-SPECIFIED',
        academicYear: academicYear || '2026-2027',
        idCardBase64,
        status: 'pending_manual_review',
        tag,
        confidenceScore,
        flaggedSuspicious: true,
        suspicionReason: ocrResult.reason,
        aiAnalysis: ocrResult.analysis || null,
        error: ocrResult.error || null,
        submittedAt: new Date().toISOString()
      };

      pendingVerificationsStore.set(verificationId, pendingRecord);

      // Save user state as pending
      const userEligibility = {
        status: 'pending',
        method: 'student_id_upload',
        institution: collegeName,
        verificationId,
        tag,
        confidenceScore,
        flaggedSuspicious: true,
        reason: ocrResult.reason,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      eligibilityStore.set(clerkUser.id, userEligibility);

      return res.json({
        success: true,
        requiresManualReview: true,
        message: 'Your Student ID has been sent to the Admin Panel for verification.',
        studentEligibility: userEligibility
      });
    }

    // Clean pass - Verified by Groq OCR
    const verifiedRecord = {
      status: 'verified',
      method: 'groq_ocr_verified',
      institution: collegeName,
      studentIdNumber: ocrResult.analysis?.detectedStudentId || studentIdNumber || 'VERIFIED',
      academicYear: academicYear || '2026-2027',
      tag: 'genuine',
      confidenceScore,
      ocrSummary: ocrResult.analysis?.summary,
      submittedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    eligibilityStore.set(clerkUser.id, verifiedRecord);

    // Also record in verifications store so admin can inspect verified submissions
    pendingVerificationsStore.set(verificationId, {
      verificationId,
      userId: clerkUser.id,
      userEmail: email,
      userName,
      institution: collegeName,
      studentIdNumber: verifiedRecord.studentIdNumber,
      academicYear: verifiedRecord.academicYear,
      idCardBase64,
      status: 'approved',
      tag: 'genuine',
      confidenceScore,
      flaggedSuspicious: false,
      suspicionReason: null,
      aiAnalysis: ocrResult.analysis || null,
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      reviewNotes: 'Automatically approved by AI / OCR'
    });

    return res.json({
      success: true,
      requiresManualReview: false,
      message: 'Student ID successfully verified by automated OCR! Student passes are unlocked.',
      studentEligibility: verifiedRecord
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
  }
});

// ── Admin Authentication Endpoint ─────────────────────────────────────────────

// POST /api/admin/login - Authenticate admin with email & password
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim() || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateAdminToken(email);
    return res.json({
      success: true,
      token,
      email: ADMIN_EMAIL,
      message: 'Admin authenticated successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error: ' + err.message });
  }
});

// GET /api/admin/verify-token - Verify if admin token is still valid
app.get('/api/admin/verify-token', requireAdminAuth, (req, res) => {
  return res.json({ success: true, email: req.adminUser.email, role: 'admin' });
});

// ── Admin Panel Verification Endpoints ────────────────────────────────────────

// GET /api/admin/verifications - List all submissions for manual review
app.get('/api/admin/verifications', requireAdminAuth, async (req, res) => {
  try {
    const list = Array.from(pendingVerificationsStore.values()).sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    return res.json({
      success: true,
      verifications: list
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/verifications/:id/review - Approve or reject manual ID submission
app.post('/api/admin/verifications/:id/review', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'approve' | 'reject'

    const record = pendingVerificationsStore.get(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Verification record not found.' });
    }

    if (action === 'approve') {
      record.status = 'approved';
      record.reviewedAt = new Date().toISOString();
      record.reviewNotes = notes || 'Manually approved by administrator';

      const verifiedRecord = {
        status: 'verified',
        method: 'manual_admin_approved',
        institution: record.institution,
        studentIdNumber: record.studentIdNumber,
        academicYear: record.academicYear,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      eligibilityStore.set(record.userId, verifiedRecord);
      pendingVerificationsStore.set(id, record);

      return res.json({
        success: true,
        message: `Student verification for ${record.userEmail} approved! Student discounts unlocked.`
      });
    } else {
      record.status = 'rejected';
      record.reviewedAt = new Date().toISOString();
      record.reviewNotes = notes || 'Rejected by administrator';

      const rejectedRecord = {
        status: 'rejected',
        method: 'manual_admin_rejected',
        reason: notes || 'Student ID was rejected by administrator.',
        updatedAt: new Date().toISOString()
      };

      eligibilityStore.set(record.userId, rejectedRecord);
      pendingVerificationsStore.set(id, record);

      return res.json({
        success: true,
        message: `Student verification for ${record.userEmail} rejected.`
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
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

      // If KonfHub rejects capture because this pass requires online payment gateway checkout:
      if (ticketConfig.price > 0) {
        const baseWidget = ticketConfig.konfhubWidgetUrl || 'https://konfhub.com/widget/id/38580027-52e6-43dc-b984-7b86d3a7b56c';
        const separator = baseWidget.includes('?') ? '&' : '?';
        const checkoutUrl = `${baseWidget}${separator}email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
        return res.status(200).json({
          success: true,
          requiresPaymentGateway: true,
          checkoutUrl,
          ticket: ticketConfig,
          message: 'Opening secure checkout for ' + ticketConfig.name + '...'
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
