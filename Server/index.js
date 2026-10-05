import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClerkClient, verifyToken } from '@clerk/backend';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Clerk backend client ──────────────────────────────────────────────────────
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ── KonfHub config (never exposed to frontend) ────────────────────────────────
const KONFHUB_API_KEY    = process.env.KONFHUB_API_KEY;
const KONFHUB_EVENT_ID   = process.env.KONFHUB_EVENT_ID;
// KonfHub API expects purely numeric ticket ID (e.g. "122834") inside registration_details
const RAW_TICKET_ID          = process.env.KONFHUB_TCET_TICKET_ID || '122834';
const KONFHUB_TCET_TICKET_ID = RAW_TICKET_ID.split('|')[0].replace(/[^0-9]/g, '');

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ── Helper: extract & verify Clerk session token from Authorization header ────
async function getVerifiedClerkUser(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) throw new Error('Missing bearer token');

  // verifyToken validates the JWT using Clerk's JWKS
  const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
  if (!payload || !payload.sub) throw new Error('Invalid Clerk token');

  // Fetch the full user object (includes email addresses)
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
async function checkExistingKonfHubRegistration(email) {
  try {
    const url = `https://api.konfhub.com/event/capture/v2/validate?event_id=${encodeURIComponent(KONFHUB_EVENT_ID)}&ticket_id=${encodeURIComponent(KONFHUB_TCET_TICKET_ID)}&email=${encodeURIComponent(email)}`;
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
    console.warn('[KonfHub] Validation call failed, proceeding with registration:', err.message);
    return { alreadyRegistered: false };
  }
}

// ── Helper: capture TCET free ticket on KonfHub ───────────────────────────────
async function captureKonfHubFreeTicket(name, email) {
  const body = {
    event_id: KONFHUB_EVENT_ID,
    registration_tz: 'Asia/Kolkata',
    registration_details: {
      [KONFHUB_TCET_TICKET_ID]: [
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
// POST /api/registrations
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/registrations', async (req, res) => {
  try {
    // 1. Authenticate via Clerk
    let clerkUser;
    try {
      clerkUser = await getVerifiedClerkUser(req);
    } catch (authErr) {
      return res.status(401).json({ success: false, message: 'Unauthorized: ' + authErr.message });
    }

    // 2. Get verified email
    const email = getPrimaryEmail(clerkUser);
    if (!email) {
      return res.status(400).json({ success: false, message: 'No verified email found on Clerk account.' });
    }

    const name = clerkUser.fullName || clerkUser.firstName || email.split('@')[0];

    // 3. Non-TCET: instruct frontend to open KonfHub widget
    if (!isTCETEmail(email)) {
      return res.status(200).json({
        success: true,
        isTCET: false,
        action: 'USE_KONFHUB_WIDGET',
        message: 'Please use the KonfHub widget to purchase a paid ticket.'
      });
    }

    // 4a. Check for duplicate registration (idempotency)
    const { alreadyRegistered, data: existingData } = await checkExistingKonfHubRegistration(email);
    if (alreadyRegistered) {
      return res.status(200).json({
        success: true,
        isTCET: true,
        alreadyRegistered: true,
        message: 'You are already registered with a TCET free pass!',
        registrationData: existingData
      });
    }

    // 4b. Create new free registration
    let konfhubResult;
    try {
      konfhubResult = await captureKonfHubFreeTicket(name, email);
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
  res.json({ status: 'ok', service: 'esummit-backend', timestamp: new Date().toISOString() });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`E-Summit backend running on http://localhost:${PORT}`);
  console.log(`   KonfHub Event ID : ${KONFHUB_EVENT_ID}`);
  console.log(`   TCET Ticket ID   : ${KONFHUB_TCET_TICKET_ID}`);
});
