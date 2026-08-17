import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { Pool } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';
import multer from 'multer';
import dotenv from 'dotenv';
import fs from 'fs';
import {
  translateMessage,
  inMemoryGlossaryRecommendations,
  inMemoryApprovedGlossary
} from './server/translationService';
import { getIndexableSitemapUrls } from './src/data/hubSeoData';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Security & CORS Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint for monitoring & reverse proxy
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve local uploaded files via a protected route instead of public static folder
app.get(['/uploads/:filename', '/upload/:filename'], (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Return transparent 1x1 png or 404 gracefully without breaking client UI
    res.status(404).send('File not found');
  }
});

// SEO Endpoints (Sitemap & Robots.txt) - Single Source of Truth
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.sendFile(robotsPath);
  } else {
    res.send(`User-agent: *
Allow: /
Allow: /portugal
Allow: /algarve
Allow: /how-it-works
Allow: /partner
Allow: /knowledge-base

Disallow: /pitch/
Disallow: /pitch/*
Disallow: /dashboard
Disallow: /pro
Disallow: /tpartner
Disallow: /operator
Disallow: /admin
Disallow: /super-admin
Disallow: /api/

Sitemap: https://nordbase.pt/sitemap.xml`);
  }
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.sendFile(sitemapPath);
  } else {
    const urls = getIndexableSitemapUrls();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const item of urls) {
      xml += `  <url>\n    <loc>${item.url}</loc>\n    <changefreq>${item.changefreq}</changefreq>\n    <priority>${item.priority.toFixed(1)}</priority>\n  </url>\n`;
    }
    xml += `</urlset>`;
    res.send(xml);
  }
});

// In-memory fallback database for graceful local testing when database variables are not set
let inMemoryUsers: any[] = [
  {
    id: 'user-super-01',
    email: 'ironstorm174@gmail.com',
    phone: '+351 901 000 000',
    name: 'Oleg (Territorial Partner)',
    role: 'super_admin',
    specialistStatus: 'not_requested',
    dashboardNumber: '01',
    photoUrl: '/portimao_tp.jpg',
    city: 'Portimão',
    region: 'Algarve'
  },
  {
    id: 'user-rp-dana',
    email: 'astrologforme@gmail.com',
    phone: '+351 912 000 001',
    name: 'Dana (Regional Director)',
    role: 'regional_admin',
    specialistStatus: 'not_requested',
    dashboardNumber: 'RD-01',
    city: 'Faro',
    region: 'Portugal'
  }
];

let inMemorySpecialists: any[] = [];

let inMemoryJobs: any[] = [];

let inMemoryPartnerApplications: any[] = [];

// Initialize Neon Pool if string is configured
let pool: Pool | null = null;
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (dbUrl) {
  try {
    pool = new Pool({ connectionString: dbUrl });
    console.log('Neon Pool initialized.');
  } catch (err) {
    console.error('Failed to initialize Neon Pool:', err);
  }
} else {
  console.log('Database URL is not set (DATABASE_URL / POSTGRES_URL). Falling back to in-memory database store.');
}

// ============================================================================
// SERVER-SIDE IDEMPOTENCY ENGINE (FIX 6)
// ============================================================================

interface IdempotencyRecord {
  id: string;
  userId: string;
  idempotencyKey: string;
  operation: string;
  resourceId?: string;
  status: number;
  response: any;
  createdAt: string;
}

const inMemoryIdempotencyRecords = new Map<string, IdempotencyRecord>();

async function getIdempotencyRecord(userId: string, idempotencyKey: string): Promise<IdempotencyRecord | null> {
  const mapKey = `${userId}:${idempotencyKey}`;
  if (pool) {
    try {
      const client = await pool.connect();
      const res = await client.query(
        'SELECT * FROM idempotency_records WHERE user_id = $1 AND idempotency_key = $2',
        [userId, idempotencyKey]
      );
      client.release();
      if (res.rows.length > 0) {
        const row = res.rows[0];
        const record: IdempotencyRecord = {
          id: row.id,
          userId: row.user_id,
          idempotencyKey: row.idempotency_key,
          operation: row.operation,
          resourceId: row.resource_id || undefined,
          status: row.status,
          response: typeof row.response === 'string' ? JSON.parse(row.response) : row.response,
          createdAt: new Date(row.created_at).toISOString()
        };
        inMemoryIdempotencyRecords.set(mapKey, record);
        return record;
      }
    } catch (e) {
      console.error('Error fetching idempotency record from DB:', e);
    }
  }
  return inMemoryIdempotencyRecords.get(mapKey) || null;
}

async function saveIdempotencyRecord(
  userId: string,
  idempotencyKey: string,
  operation: string,
  resourceId: string | undefined,
  status: number,
  response: any
): Promise<void> {
  const record: IdempotencyRecord = {
    id: `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    idempotencyKey,
    operation,
    resourceId,
    status,
    response,
    createdAt: new Date().toISOString()
  };

  const mapKey = `${userId}:${idempotencyKey}`;
  inMemoryIdempotencyRecords.set(mapKey, record);

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO idempotency_records (id, user_id, idempotency_key, operation, resource_id, status, response)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, operation, idempotency_key) DO UPDATE
         SET status = EXCLUDED.status, response = EXCLUDED.response`,
        [record.id, userId, idempotencyKey, operation, resourceId || null, status, JSON.stringify(response)]
      );
      client.release();
    } catch (e) {
      console.error('Error saving idempotency record to DB:', e);
    }
  }
}

function extractIdempotencyKey(req: express.Request): string | null {
  const headerKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key'];
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }
  if (Array.isArray(headerKey) && headerKey[0] && headerKey[0].trim()) {
    return headerKey[0].trim();
  }
  if (req.body && typeof req.body.idempotencyKey === 'string' && req.body.idempotencyKey.trim()) {
    return req.body.idempotencyKey.trim();
  }
  return null;
}

// ============================================================================
// SERVER-SIDE AUTHENTICATION & TOKEN INFRASTRUCTURE
// ============================================================================

let devFallbackSecret: string | null = null;
function getCryptoSecret(): string {
  const secret = process.env.CRYPTO_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRYPTO_SECRET environment variable is missing in production environment');
  }
  if (!devFallbackSecret) {
    devFallbackSecret = crypto.randomBytes(32).toString('hex');
  }
  return devFallbackSecret;
}

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function generateAuthToken(userId: string): string {
  const iat = Date.now();
  const exp = iat + (7 * 24 * 60 * 60 * 1000); // 7 days token
  const payload: TokenPayload = { userId, iat, exp };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', getCryptoSecret());
  hmac.update(payloadBase64);
  const signature = hmac.digest('base64url');

  return `${payloadBase64}.${signature}`;
}

export const issueAuthToken = generateAuthToken;

export function verifyAndDecodeToken(token: string): TokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;
  if (!payloadBase64 || !signature) return null;

  try {
    const hmac = crypto.createHmac('sha256', getCryptoSecret());
    hmac.update(payloadBase64);
    const expectedSignature = hmac.digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: TokenPayload = JSON.parse(jsonStr);

    if (!payload.userId || !payload.iat || !payload.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export async function findUserById(userId: string) {
  if (pool) {
    let client: any = null;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM app_users WHERE id = $1', [userId]);
      if (res.rows.length > 0) {
        const u = res.rows[0];
        return {
          id: u.id,
          email: u.email,
          phone: u.phone,
          name: u.name,
          role: u.role,
          specialistStatus: u.specialist_status || u.specialistStatus || 'not_requested',
          isBlocked: u.is_blocked || u.isBlocked || false,
          dashboardNumber: u.dashboard_number || u.dashboardNumber,
          region: u.region,
          city: u.city,
        };
      }
    } catch (err) {
      console.error('Error finding user by id in Postgres:', err);
    } finally {
      if (client) {
        try { client.release(); } catch (e) {
          // ignore release error
        }
      }
    }
  }

  const mem = inMemoryUsers.find(u => u.id === userId);
  if (mem) {
    return {
      id: mem.id,
      email: mem.email,
      phone: mem.phone,
      name: mem.name,
      role: mem.role,
      specialistStatus: mem.specialistStatus || 'not_requested',
      isBlocked: mem.isBlocked || false,
      dashboardNumber: mem.dashboardNumber,
      region: mem.region,
      city: mem.city,
    };
  }

  return null;
}

export async function findJobById(jobId: string) {
  if (pool) {
    let client: any = null;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
      if (res.rows.length > 0) {
        const j = res.rows[0];
        let messages = [];
        try {
          messages = typeof j.messages === 'string' ? JSON.parse(j.messages) : (j.messages || []);
        } catch (e) {
          messages = [];
        }
        return {
          id: j.id,
          category: j.category,
          city: j.city,
          specificLocation: j.specific_location,
          description: j.description,
          estimatedHours: j.estimated_hours,
          estimatedValue: j.estimated_value,
          leadPrice: j.lead_price,
          status: j.status,
          createdAt: j.created_at,
          customerName: j.customer_name,
          customerPhone: j.customer_phone,
          customerId: j.customer_id,
          unlockedBySpecialistId: j.unlocked_by_specialist_id,
          coordinatorId: j.coordinator_id,
          coordinatorNotes: j.coordinator_notes,
          hubId: j.hub_id,
          region: j.region,
          attachments: j.attachments || [],
          messages,
          customerCompleted: j.customer_completed || false,
          customerCompletedAt: j.customer_completed_at ? new Date(j.customer_completed_at).toISOString() : undefined,
          customerCompletion: typeof j.customer_completion === 'string' ? JSON.parse(j.customer_completion) : j.customer_completion || undefined,
          specialistCompleted: j.specialist_completed || false,
          specialistCompletedAt: j.specialist_completed_at ? new Date(j.specialist_completed_at).toISOString() : undefined,
          specialistCompletion: typeof j.specialist_completion === 'string' ? JSON.parse(j.specialist_completion) : j.specialist_completion || undefined,
          rating: j.rating ? parseFloat(j.rating) : undefined,
          positiveTags: j.positive_tags || [],
          customerComment: j.customer_comment || undefined,
          specialistAssessedValue: j.specialist_assessed_value ? parseFloat(j.specialist_assessed_value) : undefined,
          customerPriceAccepted: j.customer_price_accepted !== null && j.customer_price_accepted !== undefined ? j.customer_price_accepted : true,
          finalPrice: j.final_price ? parseFloat(j.final_price) : undefined,
          calloutFeePending: j.callout_fee_pending || false,
          calloutFeeAmount: j.callout_fee_amount ? parseFloat(j.callout_fee_amount) : 0
        };
      }
    } catch (err) {
      console.error('Error finding job by id in Postgres:', err);
    } finally {
      if (client) {
        try { client.release(); } catch (e) {
          // ignore client release error
        }
      }
    }
  }

  const mem = inMemoryJobs.find(j => j.id === jobId);
  if (mem) {
    return mem;
  }

  return null;
}

export interface AuthenticatedRequest extends express.Request {
  authenticatedUser?: {
    id: string;
    email: string;
    role: string;
    name?: string;
    phone?: string;
    dashboardNumber?: string;
    region?: string;
    city?: string;
    specialistStatus?: string;
  };
}

export async function verifyAuthToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = verifyAndDecodeToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await findUserById(payload.userId);
  if (!user || user.isBlocked) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  (req as AuthenticatedRequest).authenticatedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    phone: user.phone,
    dashboardNumber: user.dashboardNumber,
    region: user.region,
    city: user.city,
    specialistStatus: user.specialistStatus
  };

  next();
}

export function requireSuperAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as AuthenticatedRequest).authenticatedUser;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as AuthenticatedRequest).authenticatedUser;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `Forbidden: Access requires one of roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
}

// Ensure Database Tables Exist on Neon Startup
async function initDb() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    console.log('Connected to Neon successfully. Synchronizing schema...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        specialist_status VARCHAR(50) NOT NULL,
        city VARCHAR(255),
        category VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Individual migration safety blocks so no single failure stops schema sync
    const safeQueries = [
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS photo_url TEXT;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS dashboard_number VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS region VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS trade_skill_level VARCHAR(255);`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS skills_description TEXT;`,
      `ALTER TABLE app_users ADD COLUMN IF NOT EXISTS specialties_with_levels JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hub_id VARCHAR(255);`,
      
      `ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_email_key;`,
      `ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_phone_key;`,
      `DROP INDEX IF EXISTS app_users_email_key;`,
      `DROP INDEX IF EXISTS app_users_email_idx;`,
      `DROP INDEX IF EXISTS app_users_phone_idx;`,
      `DROP INDEX IF EXISTS app_users_phone_key;`,

      `CREATE TABLE IF NOT EXISTS specialists (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        balance NUMERIC DEFAULT 100,
        unlocked_jobs TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        specific_location TEXT NOT NULL,
        description TEXT NOT NULL,
        estimated_hours NUMERIC DEFAULT 1,
        estimated_value NUMERIC DEFAULT 0,
        lead_price NUMERIC DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(255) NOT NULL,
        unlocked_by_specialist_id VARCHAR(255),
        coordinator_id VARCHAR(255),
        hub_id VARCHAR(255),
        coordinator_notes TEXT,
        attachments TEXT[] DEFAULT '{}',
        messages JSONB DEFAULT '[]'::jsonb
      );`,

      `CREATE TABLE IF NOT EXISTS partner_applications (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        experience TEXT,
        current_activity TEXT,
        team_size_or_capital TEXT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS photo_url TEXT;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS trade_skill_level VARCHAR(255);`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS skills_description TEXT;`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending_review';`,
      `ALTER TABLE specialists ADD COLUMN IF NOT EXISTS specialties_with_levels JSONB DEFAULT '[]'::jsonb;`,

      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completed BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completed_at TIMESTAMP;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completed BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completed_at TIMESTAMP;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_completion JSONB;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_completion JSONB;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rating NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS positive_tags TEXT[] DEFAULT '{}';`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_comment TEXT;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS specialist_assessed_value NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_price_accepted BOOLEAN DEFAULT true;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS final_price NUMERIC;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS callout_fee_pending BOOLEAN DEFAULT false;`,
      `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS callout_fee_amount NUMERIC DEFAULT 0;`,

      `CREATE TABLE IF NOT EXISTS lead_unlock_transactions (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL,
        specialist_id VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      `CREATE TABLE IF NOT EXISTS idempotency_records (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        idempotency_key VARCHAR(255) NOT NULL,
        operation VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        status INT NOT NULL,
        response JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_op_key UNIQUE (user_id, operation, idempotency_key)
      );`,

      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'check_specialist_balance_positive'
        ) THEN
          ALTER TABLE specialists ADD CONSTRAINT check_specialist_balance_positive CHECK (balance >= 0);
        END IF;
      END $$;`
    ];

    for (const q of safeQueries) {
      try {
        await client.query(q);
      } catch (e: any) {
        console.warn('Individual schema migration statement note:', e.message);
      }
    }

    // Attempt to drop any existing UNIQUE constraints dynamically from app_users
    try {
      const uRes = await client.query(`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'app_users' AND constraint_type = 'UNIQUE'
      `);
      for (const row of uRes.rows) {
        try {
          await client.query(`ALTER TABLE app_users DROP CONSTRAINT IF EXISTS "${row.constraint_name}"`);
        } catch (e: any) {
          console.warn(`Could not drop unique constraint ${row.constraint_name}:`, e.message);
        }
      }
    } catch (e: any) {
      console.warn('Dynamic constraint lookup skipped:', e.message);
    }

    // Pre-populate tables if they are empty or clean mock seed data
    try {
      await client.query(`
        DELETE FROM app_users 
        WHERE (email LIKE '%@example.com' OR email LIKE '%@example.fr' OR email LIKE '%simulation%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%')
          AND id NOT IN ('user-super-01', 'user-super_admin');
      `);
      await client.query(`
        DELETE FROM specialists 
        WHERE phone LIKE '+351 920%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%';
      `);
      await client.query(`
        DELETE FROM jobs 
        WHERE title LIKE '[Simulation]%' OR title LIKE '[Test]%';
      `);

      // Always guarantee SuperAdmin accounts are present in app_users
      const superAdmins = [
        {
          id: 'user-super-01',
          email: 'ironstorm174@gmail.com',
          phone: '+351 901 000 000',
          name: 'Oleg (Territorial Partner)',
          role: 'super_admin',
          dashboardNumber: '01',
          photoUrl: '/portimao_tp.jpg',
          city: 'Portimão',
          region: 'Algarve'
        },
        {
          id: 'user-super-tp',
          email: 'timeplace.internal@gmail.com',
          phone: '+351 902 000 000',
          name: 'Timeplace Admin',
          role: 'super_admin',
          dashboardNumber: '01',
          city: 'Portimão',
          region: 'Algarve'
        }
      ];

      for (const sa of superAdmins) {
        const checkRes = await client.query('SELECT * FROM app_users WHERE id = $1', [sa.id]);
        if (checkRes.rows.length === 0) {
          await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, dashboard_number, photo_url) 
             VALUES ($1, $2, $3, $4, $5, 'approved', $6, $7, $8)`,
            [sa.id, sa.email, sa.phone, sa.name, sa.role, sa.city, sa.dashboardNumber, sa.photoUrl || null]
          );
        } else {
          await client.query(
            `UPDATE app_users 
             SET email = $1, role = 'super_admin', dashboard_number = '01', is_blocked = false 
             WHERE id = $2`,
            [sa.email, sa.id]
          );
        }
      }

      const usersCount = await client.query('SELECT COUNT(*) FROM app_users');
      if (parseInt(usersCount.rows[0].count) === 0) {
        console.log('Pre-populating users table with seed data...');
        for (const u of inMemoryUsers) {
          await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, category) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [u.id, u.email, u.phone, u.name, u.role, u.specialistStatus, u.city || null, u.category || null]
          );
        }
      }
    } catch (e: any) {
      console.warn('User seed check note:', e.message);
    }

    try {
      const specialistsCount = await client.query('SELECT COUNT(*) FROM specialists');
      if (parseInt(specialistsCount.rows[0].count) === 0) {
        console.log('Pre-populating specialists table with seed data...');
        for (const s of inMemorySpecialists) {
          await client.query(
            `INSERT INTO specialists (id, name, phone, category, city, balance, unlocked_jobs) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [s.id, s.name, s.phone, s.category, s.city, s.balance, s.unlockedJobs]
          );
        }
      }
    } catch (e: any) {
      console.warn('Specialist seed check note:', e.message);
    }

    client.release();
    console.log('Database schema and seed synchronization complete.');
  } catch (err) {
    console.error('Error synchronizing database schemas:', err);
  }
}

// Run async initialization safely without blocking module export
initDb().catch(err => console.error('Initial DB sync background error:', err));

// Multer memory storage for file uploads (max 10MB)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Endpoint to purge all simulation/mock accounts and activity traces
app.post('/api/admin/clean-mock-data', verifyAuthToken, requireSuperAdmin, async (req, res) => {
  try {
    inMemoryUsers = inMemoryUsers.filter(u => 
      u.id === 'user-super_admin' || 
      u.id === 'user-super-01' || 
      ['super_admin', 'regional_admin', 'operator'].includes(u.role) ||
      (!u.email?.endsWith('@example.com') && !u.email?.endsWith('@example.fr') && !u.email?.includes('simulation'))
    );
    inMemorySpecialists = [];
    inMemoryJobs = [];
    inMemoryPartnerApplications = [];

    if (pool) {
      const client = await pool.connect();
      try {
        await client.query(`
          DELETE FROM app_users 
          WHERE (email LIKE '%@example.com' OR email LIKE '%@example.fr' OR email LIKE '%simulation%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%')
            AND id NOT IN ('user-super-01', 'user-super_admin');
        `);
        await client.query(`
          DELETE FROM specialists 
          WHERE phone LIKE '+351 920%' OR name LIKE '%[Simulation]%' OR name LIKE '%[Test]%';
        `);
        await client.query(`
          DELETE FROM jobs 
          WHERE title LIKE '[Simulation]%' OR title LIKE '[Test]%';
        `);
      } finally {
        client.release();
      }
    }
    return res.json({ success: true, message: 'All simulation accounts and activity traces purged.' });
  } catch (err: any) {
    console.error('Error purging simulation data:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// UNIVERSAL AI MULTILINGUAL TRANSLATION SERVICE ENDPOINTS
// ============================================================================

// Core Translation Endpoint
app.post('/api/translate', verifyAuthToken, async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage, context } = req.body;
    if (!text || typeof text !== 'string' || text.length > 2000) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }
    const result = await translateMessage(
      text,
      targetLanguage || 'pt',
      sourceLanguage,
      context
    );
    return res.json(result);
  } catch (err: any) {
    console.error('Translation endpoint error:', err);
    return res.status(500).json({
      error: 'Translation processing failed',
      originalText: req.body?.text || '',
      translatedText: req.body?.text || '',
      targetLanguage: req.body?.targetLanguage || 'pt',
      detectedLanguage: 'auto',
      cached: false,
      recommendation: null
    });
  }
});

// Get Pending Knowledge Evolution Glossary Recommendations
app.get('/api/translate/glossary-recommendations', verifyAuthToken, requireRole(['operator', 'regional_admin', 'super_admin']), async (req, res) => {
  try {
    const pending = inMemoryGlossaryRecommendations.filter(r => r.status === 'pending');
    return res.json(pending);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Approve Knowledge Evolution Glossary Recommendation
app.post('/api/translate/glossary-recommendations/approve', verifyAuthToken, requireRole(['operator', 'regional_admin', 'super_admin']), async (req, res) => {
  try {
    const { id, term, translations, category } = req.body;
    const recIndex = inMemoryGlossaryRecommendations.findIndex(r => r.id === id);
    if (recIndex !== -1) {
      inMemoryGlossaryRecommendations[recIndex].status = 'approved';
    }

    const newTermName = term || (recIndex !== -1 ? inMemoryGlossaryRecommendations[recIndex].originalTerm : 'New Term');
    const newTranslations = translations || (recIndex !== -1 ? inMemoryGlossaryRecommendations[recIndex].suggestedTranslations : { pt: newTermName, en: newTermName, ru: newTermName });

    const approvedObj = {
      id: `g-${Date.now()}`,
      term: newTermName,
      translations: newTranslations,
      category: category || 'trade'
    };

    inMemoryApprovedGlossary.push(approvedObj);
    return res.json({ success: true, term: approvedObj });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to approve recommendation' });
  }
});

// Reject Knowledge Evolution Glossary Recommendation
app.delete('/api/translate/glossary-recommendations/:id', verifyAuthToken, requireRole(['operator', 'regional_admin', 'super_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const rec = inMemoryGlossaryRecommendations.find(r => r.id === id);
    if (rec) {
      rec.status = 'rejected';
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reject recommendation' });
  }
});

// Get Active Approved Glossary
app.get('/api/translate/glossary', async (req, res) => {
  try {
    return res.json(inMemoryApprovedGlossary);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch glossary' });
  }
});

// 1. Get Database Connection Status & Rich Diagnostics
app.get('/api/db-status', async (req, res) => {
  let isNeonConnected = false;
  let dbMessage = 'Not connected';
  let latencyMs = -1;
  const counts = { users: 0, specialists: 0, jobs: 0 };
  const schemaCheck = {
    users_photo_url_exists: false,
    users_docs_exists: false,
    specialists_photo_url_exists: false,
    specialists_docs_exists: false,
  };

  const start = Date.now();
  if (pool) {
    try {
      const client = await pool.connect();
      
      // Measure latency
      await client.query('SELECT 1');
      latencyMs = Date.now() - start;
      
      isNeonConnected = true;
      dbMessage = 'Neon PostgreSQL Connected successfully!';
      
      // Get counts
      const usersRes = await client.query('SELECT COUNT(*) FROM app_users');
      const specsRes = await client.query('SELECT COUNT(*) FROM specialists');
      const jobsRes = await client.query('SELECT COUNT(*) FROM jobs');
      
      counts.users = parseInt(usersRes.rows[0].count, 10);
      counts.specialists = parseInt(specsRes.rows[0].count, 10);
      counts.jobs = parseInt(jobsRes.rows[0].count, 10);
      
      // Verify columns exist by querying column configurations
      const columnCheck = await client.query(`
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_name IN ('app_users', 'specialists') 
          AND column_name IN ('photo_url', 'verification_documents')
      `);
      
      columnCheck.rows.forEach((row: any) => {
        if (row.table_name === 'app_users' && row.column_name === 'photo_url') {
          schemaCheck.users_photo_url_exists = true;
        }
        if (row.table_name === 'app_users' && row.column_name === 'verification_documents') {
          schemaCheck.users_docs_exists = true;
        }
        if (row.table_name === 'specialists' && row.column_name === 'photo_url') {
          schemaCheck.specialists_photo_url_exists = true;
        }
        if (row.table_name === 'specialists' && row.column_name === 'verification_documents') {
          schemaCheck.specialists_docs_exists = true;
        }
      });

      client.release();
    } catch (err: any) {
      dbMessage = `Connection error: ${err.message || err}`;
    }
  } else {
    dbMessage = 'DATABASE_URL / POSTGRES_URL is not configured. Falling back to in-memory state.';
    // In-memory counts fallback
    counts.users = inMemoryUsers.length;
    counts.specialists = inMemorySpecialists.length;
    counts.jobs = inMemoryJobs.length;
  }

  const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.STORAGE_READ_WRITE_TOKEN;

  res.json({
    neon: {
      configured: !!dbUrl,
      connected: isNeonConnected,
      message: dbMessage,
      latencyMs,
      counts,
      schemaCheck,
    },
    blob: {
      configured: isBlobConfigured,
      message: isBlobConfigured 
        ? 'Vercel Blob storage is configured and ready!' 
        : 'BLOB_READ_WRITE_TOKEN is not configured. Falling back to local/base64 uploads.'
    }
  });
});

// 2. Fetch Data / Synchronization Endpoint with Server-Side Data Isolation & RBAC
const handleDataSync = async (req: express.Request, res: express.Response) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser;
  if (!caller || !caller.role) {
    return res.status(401).json({ error: 'Unauthorized: Valid authentication token required' });
  }

  let rawUsers: any[] = [];
  let rawSpecialists: any[] = [];
  let rawJobs: any[] = [];
  let rawPartnerApplications: any[] = [];

  if (pool) {
    try {
      const client = await pool.connect();
      const usersRes = await client.query('SELECT * FROM app_users');
      const specsRes = await client.query('SELECT * FROM specialists');
      const jobsRes = await client.query('SELECT * FROM jobs ORDER BY created_at DESC');
      const partnerAppsRes = await client.query('SELECT * FROM partner_applications ORDER BY created_at DESC');
      client.release();

      rawUsers = usersRes.rows.map(r => ({
        id: r.id,
        email: r.email,
        phone: r.phone || undefined,
        name: r.name,
        role: r.role,
        specialistStatus: r.specialist_status,
        city: r.city || undefined,
        category: r.category || undefined,
        photoUrl: r.photo_url || undefined,
        dashboardNumber: r.dashboard_number || undefined,
        region: r.region || undefined,
        isBlocked: r.is_blocked || false,
        verificationDocuments: typeof r.verification_documents === 'string' ? JSON.parse(r.verification_documents) : r.verification_documents || [],
        categories: r.categories || [],
        languages: typeof r.languages === 'string' ? JSON.parse(r.languages) : r.languages || [],
        tradeSkillLevel: r.trade_skill_level || undefined,
        skillsDescription: r.skills_description || undefined,
        specialtiesWithLevels: typeof r.specialties_with_levels === 'string' ? JSON.parse(r.specialties_with_levels) : r.specialties_with_levels || [],
      }));

      rawSpecialists = specsRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        category: r.category,
        city: r.city,
        region: r.region || undefined,
        dashboardNumber: r.dashboard_number || undefined,
        balance: parseFloat(r.balance || '0'),
        unlockedJobs: r.unlocked_jobs || [],
        photoUrl: r.photo_url || undefined,
        verificationDocuments: typeof r.verification_documents === 'string' ? JSON.parse(r.verification_documents) : r.verification_documents || [],
        categories: r.categories || [],
        languages: typeof r.languages === 'string' ? JSON.parse(r.languages) : r.languages || [],
        tradeSkillLevel: r.trade_skill_level || undefined,
        skillsDescription: r.skills_description || undefined,
        status: r.status || 'pending_review',
        specialtiesWithLevels: typeof r.specialties_with_levels === 'string' ? JSON.parse(r.specialties_with_levels) : r.specialties_with_levels || [],
      }));

      rawJobs = jobsRes.rows.map(r => ({
        id: r.id,
        category: r.category,
        city: r.city,
        region: r.region || undefined,
        hubId: r.hub_id || undefined,
        specificLocation: r.specific_location,
        description: r.description,
        estimatedHours: parseFloat(r.estimated_hours || '1'),
        estimatedValue: parseFloat(r.estimated_value || '0'),
        leadPrice: parseFloat(r.lead_price || '0'),
        status: r.status,
        createdAt: r.created_at,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerId: r.customer_id,
        unlockedBySpecialistId: r.unlocked_by_specialist_id,
        coordinatorId: r.coordinator_id,
        coordinatorNotes: r.coordinator_notes,
        operatorId: r.coordinator_id,
        operatorNotes: r.coordinator_notes,
        attachments: r.attachments || [],
        messages: typeof r.messages === 'string' ? JSON.parse(r.messages) : r.messages || [],
        customerCompleted: r.customer_completed || false,
        customerCompletedAt: r.customer_completed_at ? new Date(r.customer_completed_at).toISOString() : undefined,
        customerCompletion: typeof r.customer_completion === 'string' ? JSON.parse(r.customer_completion) : r.customer_completion || undefined,
        specialistCompleted: r.specialist_completed || false,
        specialistCompletedAt: r.specialist_completed_at ? new Date(r.specialist_completed_at).toISOString() : undefined,
        specialistCompletion: typeof r.specialist_completion === 'string' ? JSON.parse(r.specialist_completion) : r.specialist_completion || undefined,
        rating: r.rating ? parseFloat(r.rating) : undefined,
        positiveTags: r.positive_tags || [],
        customerComment: r.customer_comment || undefined,
      }));

      rawPartnerApplications = partnerAppsRes.rows.map(r => ({
        id: r.id,
        type: r.type,
        fullName: r.full_name,
        phone: r.phone,
        email: r.email,
        location: r.location,
        experience: r.experience || '',
        currentActivity: r.current_activity || '',
        teamSizeOrCapital: r.team_size_or_capital || '',
        notes: r.notes || '',
        status: r.status || 'pending',
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Error loading raw data from Neon DB, falling back to in-memory:', err);
      rawUsers = [...inMemoryUsers];
      rawSpecialists = [...inMemorySpecialists];
      rawJobs = [...inMemoryJobs];
      rawPartnerApplications = [...inMemoryPartnerApplications];
    }
  } else {
    rawUsers = [...inMemoryUsers];
    rawSpecialists = [...inMemorySpecialists];
    rawJobs = [...inMemoryJobs];
    rawPartnerApplications = [...inMemoryPartnerApplications];
  }

  // Pre-calculate unlocked specialists for customer caller if applicable
  const unlockedSpecialistIdsForCustomer = new Set<string>();
  if (caller.role === 'customer') {
    rawJobs.forEach(j => {
      const isCustomerJob = (j.customerId && j.customerId === caller.id) ||
                            (caller.phone && j.customerPhone === caller.phone) ||
                            (caller.name && j.customerName === caller.name);
      if (isCustomerJob && j.unlockedBySpecialistId) {
        unlockedSpecialistIdsForCustomer.add(j.unlockedBySpecialistId);
      }
    });
  }

  // 1. Filter Users
  const users = rawUsers
    .map(u => {
      const { password, token, ...cleanU } = u;

      if (caller.role === 'super_admin') {
        return cleanU;
      }

      if (caller.role === 'regional_admin') {
        if (u.id === caller.id) return cleanU;
        if (caller.region && u.region && u.region !== caller.region) return null;
        return cleanU;
      }

      if (caller.role === 'operator') {
        if (u.id === caller.id) return cleanU;
        if (caller.dashboardNumber && u.dashboardNumber && u.dashboardNumber !== caller.dashboardNumber) return null;
        return cleanU;
      }

      if (caller.role === 'specialist') {
        // Specialist receives ONLY their own user record
        if (u.id === caller.id) return cleanU;
        return null;
      }

      if (caller.role === 'customer') {
        if (u.id === caller.id) return cleanU;
        // Marketplace specialists (public information only)
        if (u.role === 'specialist') {
          return {
            id: u.id,
            name: u.name,
            role: u.role,
            specialistStatus: u.specialistStatus,
            city: u.city,
            category: u.category,
            photoUrl: u.photoUrl,
            categories: u.categories || [],
            languages: u.languages || [],
            tradeSkillLevel: u.tradeSkillLevel,
            skillsDescription: u.skillsDescription,
            specialtiesWithLevels: u.specialtiesWithLevels || [],
            aboutMe: u.aboutMe,
            marketplaceServices: u.marketplaceServices,
            isMarketplaceSpecialist: u.isMarketplaceSpecialist
          };
        }
        return null;
      }

      return null;
    })
    .filter(Boolean);

  // 2. Filter Specialists
  const specialists = rawSpecialists
    .map(s => {
      if (caller.role === 'super_admin') {
        return s;
      }

      if (caller.role === 'regional_admin') {
        if (caller.region && s.region && s.region !== caller.region) return null;
        return s;
      }

      if (caller.role === 'operator') {
        if (caller.dashboardNumber && s.dashboardNumber && s.dashboardNumber !== caller.dashboardNumber) return null;
        return s;
      }

      if (caller.role === 'specialist') {
        // Specialist receives ONLY their own specialist profile
        if (s.id === caller.id) return s;
        return null;
      }

      if (caller.role === 'customer') {
        const isUnlocked = unlockedSpecialistIdsForCustomer.has(s.id);
        return {
          id: s.id,
          name: s.name,
          phone: isUnlocked ? s.phone : undefined,
          category: s.category,
          city: s.city,
          district: s.district,
          region: s.region,
          balance: 0,
          unlockedJobs: [],
          photoUrl: s.photoUrl,
          verificationDocuments: [],
          categories: s.categories || [],
          languages: s.languages || [],
          tradeSkillLevel: s.tradeSkillLevel,
          skillsDescription: s.skillsDescription,
          status: s.status,
          specialtiesWithLevels: s.specialtiesWithLevels || []
        };
      }

      return null;
    })
    .filter(Boolean);

  // 3. Filter Jobs
  const jobs = rawJobs
    .map(j => {
      if (caller.role === 'super_admin') {
        return j;
      }

      if (caller.role === 'regional_admin') {
        if (caller.region && j.region && j.region !== caller.region) return null;
        return j;
      }

      if (caller.role === 'operator') {
        const isHubMatch = caller.dashboardNumber && j.hubId && j.hubId === caller.dashboardNumber;
        const isCoordinatorMatch = j.coordinatorId === caller.id || j.operatorId === caller.id;
        if (isHubMatch || isCoordinatorMatch || !caller.dashboardNumber) {
          return j;
        }
        return null;
      }

      if (caller.role === 'customer') {
        const isOwner = (j.customerId && j.customerId === caller.id) ||
                        (caller.phone && j.customerPhone === caller.phone) ||
                        (caller.name && j.customerName === caller.name);
        if (isOwner) {
          return j;
        }
        return null;
      }

      if (caller.role === 'specialist') {
        const isUnlockedByMe = j.unlockedBySpecialistId === caller.id;
        const isOfferedToMe = j.offeredSpecialistIds && Array.isArray(j.offeredSpecialistIds) && j.offeredSpecialistIds.includes(caller.id);

        if (isUnlockedByMe || isOfferedToMe) {
          return j;
        }

        const isAvailableLead = ['pending_coordinator', 'pending_operator', 'offered', 'active'].includes(j.status);
        if (!isAvailableLead) {
          return null;
        }

        // STEP 8 — LEAD CONTACT PROTECTION (CRITICAL)
        return {
          ...j,
          customerName: j.customerName ? `${j.customerName.charAt(0)}. [Locked Lead]` : 'Customer',
          customerPhone: '[Unlock Lead to View Phone]',
          specificLocation: `${j.city || 'Portugal'} (General Area)`,
          messages: [],
          coordinatorNotes: undefined,
          operatorNotes: undefined
        };
      }

      return null;
    })
    .filter(Boolean);

  // 4. Filter Partner Applications
  const partnerApplications = rawPartnerApplications
    .filter(a => {
      if (caller.role === 'super_admin') return true;
      if (caller.role === 'regional_admin') {
        return !caller.region || !a.location || a.location.includes(caller.region);
      }
      if (caller.role === 'operator') {
        return !caller.dashboardNumber || !a.location || a.location.includes(caller.dashboardNumber);
      }
      return false;
    });

  return res.json({ users, specialists, jobs, partnerApplications });
};

app.get('/api/data', verifyAuthToken, handleDataSync);
app.get('/api/sync', verifyAuthToken, handleDataSync);

// Partner Applications API Endpoints
app.post('/api/partner-applications', async (req, res) => {
  const {
    type,
    fullName,
    firstName,
    lastName,
    dob,
    phone,
    email,
    location,
    country,
    languages,
    photoUrl,
    currentActivity,
    yearsExperience,
    hasCustomerServiceExp,
    hasManagementExp,
    hasSalesExp,
    hasEntrepreneurExp,
    experience,
    hoursPerWeek,
    preferredSchedule,
    availableDays,
    hasVehicle,
    hasComputer,
    hasInternet,
    hasHomeOffice,
    teamSizeOrCapital,
    whyPartner,
    whyChooseYou,
    strengths,
    longTermGoals,
    notes,
    citiesToManage,
    businessKnowledgeLevel,
    existingNetwork,
    categoryProficiencies
  } = req.body;
  
  const constructedName = fullName || `${firstName || ''} ${lastName || ''}`.trim();

  if (!type || (!constructedName && !email) || !phone || !email) {
    return res.status(400).json({ error: 'Missing required partner application fields' });
  }

  const newApp = {
    id: `partner-app-${Date.now()}`,
    type: type || 'territorial',
    fullName: constructedName,
    firstName: firstName || '',
    lastName: lastName || '',
    dob: dob || '',
    phone,
    email,
    location: location || 'Faro',
    country: country || 'Portugal',
    languages: languages || [],
    photoUrl: photoUrl || '',
    currentActivity: currentActivity || '',
    yearsExperience: yearsExperience || '',
    hasCustomerServiceExp: !!hasCustomerServiceExp,
    hasManagementExp: !!hasManagementExp,
    hasSalesExp: !!hasSalesExp,
    hasEntrepreneurExp: !!hasEntrepreneurExp,
    experience: experience || '',
    hoursPerWeek: hoursPerWeek || '',
    preferredSchedule: preferredSchedule || '',
    availableDays: availableDays || [],
    hasVehicle: !!hasVehicle,
    hasComputer: !!hasComputer,
    hasInternet: !!hasInternet,
    hasHomeOffice: !!hasHomeOffice,
    teamSizeOrCapital: teamSizeOrCapital || '',
    whyPartner: whyPartner || '',
    whyChooseYou: whyChooseYou || '',
    strengths: strengths || '',
    longTermGoals: longTermGoals || '',
    notes: notes || '',
    citiesToManage: citiesToManage || [],
    businessKnowledgeLevel: businessKnowledgeLevel || '',
    existingNetwork: existingNetwork || '',
    categoryProficiencies: categoryProficiencies || [],
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO partner_applications (id, type, full_name, phone, email, location, experience, current_activity, team_size_or_capital, notes, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          newApp.id,
          newApp.type,
          newApp.fullName,
          newApp.phone,
          newApp.email,
          newApp.location,
          JSON.stringify(newApp), // Save full JSON payload in experience text column to preserve all wizard details in Postgres
          newApp.currentActivity,
          newApp.teamSizeOrCapital,
          newApp.notes,
          newApp.status,
          newApp.createdAt
        ]
      );
      client.release();
      return res.json({ success: true, application: newApp });
    } catch (err) {
      console.error('Error saving partner application to Neon:', err);
    }
  }

  inMemoryPartnerApplications.unshift(newApp);
  res.json({ success: true, application: newApp });
});

app.post('/api/partner-applications/:id/status', verifyAuthToken, requireRole(['operator', 'regional_admin', 'super_admin']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(`UPDATE partner_applications SET status = $1 WHERE id = $2`, [status, id]);
      client.release();
      return res.json({ success: true });
    } catch (err) {
      console.error('Error updating partner application status:', err);
    }
  }

  const appItem = inMemoryPartnerApplications.find(a => a.id === id);
  if (appItem) {
    appItem.status = status;
  }
  res.json({ success: true });
});

// Helper to get Google OAuth redirect URI (handles AI Studio iframe / cloud run reverse proxy)
function getGoogleRedirectUri(req: express.Request): string {
  if (process.env.APP_URL) {
    const cleanUrl = process.env.APP_URL.replace(/\/$/, '');
    return `${cleanUrl}/api/auth/google/callback`;
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}/api/auth/google/callback`;
}

// Shared authentication helper for both email/phone login and Google OAuth
async function authenticateOrRegisterUser(
  email: string,
  phone: string,
  name: string,
  chosenRole?: string,
  password?: string,
  dashboardNumber?: string,
  isRegistration?: boolean
) {
  const normalizedEmail = email ? email.toLowerCase().trim() : '';
  const normalizedPhone = phone ? phone.trim() : '';
  const targetRole = chosenRole || 'customer';

  const allowedSuperAdmins = ['timeplace.internal@gmail.com', 'ironstorm174@gmail.com', 'oleg'];
  const isSuperAdminEmail = Boolean(
    normalizedEmail && allowedSuperAdmins.some(a => normalizedEmail.includes(a) || a.includes(normalizedEmail))
  );

  // Prevent registration of privileged roles by standard callers
  if (isRegistration && ['super_admin', 'regional_admin', 'operator'].includes(targetRole)) {
    if (targetRole === 'super_admin') {
      if (!isSuperAdminEmail) {
        return { error: 'Privileged role registration is strictly forbidden.' };
      }
    } else {
      return { error: 'Privileged role registration is strictly forbidden.' };
    }
  }

  if (targetRole === 'super_admin' && !isSuperAdminEmail) {
    return { error: 'Access denied. You are not authorized as Super Admin.' };
  }

  const cleanPhone = normalizedPhone.replace(/[^0-9]/g, '');

  const userEmail = (normalizedEmail && !normalizedEmail.includes('@nordbase.pt'))
    ? normalizedEmail
    : `${cleanPhone || Date.now()}_${targetRole}@nordbase.pt`;

  if (pool) {
    let client: any = null;
    try {
      client = await pool.connect();

      // Special handling ONLY when logging in with explicit role super_admin
      if (targetRole === 'super_admin') {
        const superFind = await client.query(
          `SELECT * FROM app_users 
           WHERE id = 'user-super-01' OR (role = 'super_admin' AND LOWER(TRIM(email)) = LOWER(TRIM($1)))
           LIMIT 1`,
          [normalizedEmail]
        );

        let superUserRow = superFind.rows[0];
        if (!superUserRow) {
          const newSuperId = 'user-super-01';
          const insRes = await client.query(
            `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, region, dashboard_number, photo_url)
             VALUES ($1, $2, $3, $4, 'super_admin', 'approved', 'Portimão', 'Algarve', '01', '/portimao_tp.jpg')
             ON CONFLICT (id) DO UPDATE SET email = $2, role = 'super_admin', dashboard_number = '01'
             RETURNING *`,
            [newSuperId, normalizedEmail, normalizedPhone || '+351 901 000 000', name || 'Oleg (Territorial Partner)']
          );
          superUserRow = insRes.rows[0];
        }

        return {
          id: superUserRow.id,
          email: superUserRow.email || normalizedEmail,
          phone: superUserRow.phone || normalizedPhone || '+351 901 000 000',
          name: superUserRow.name || name || 'Oleg (Territorial Partner)',
          role: 'super_admin',
          specialistStatus: 'approved',
          isNewUser: false,
          photoUrl: superUserRow.photo_url || '/portimao_tp.jpg',
          city: superUserRow.city || 'Portimão',
          region: superUserRow.region || 'Algarve',
          dashboardNumber: '01',
          isBlocked: false,
        };
      }

      // Find account matching phone or email for the requested role
      const findRes = await client.query(
        `SELECT * FROM app_users 
         WHERE ((phone = $1 AND phone <> '') 
            OR (LOWER(TRIM(email)) = LOWER(TRIM($2)) AND email <> '') 
            OR (LOWER(TRIM(email)) = LOWER(TRIM($3)) AND email <> ''))
           AND role = $4`,
        [normalizedPhone, normalizedEmail, userEmail, targetRole]
      );

      const existingRoleUser = findRes.rows[0];

      if (existingRoleUser) {
        if (existingRoleUser.is_blocked || existingRoleUser.isBlocked) {
          return { error: 'Access denied. Your account is blocked. Please contact support.' };
        }
        if ((targetRole === 'operator' || targetRole === 'regional_admin') && existingRoleUser.dashboard_number && dashboardNumber && existingRoleUser.dashboard_number !== dashboardNumber) {
          return { error: 'Invalid Dashboard Number.' };
        }

        if ((!existingRoleUser.name || existingRoleUser.name === 'User') && name) {
          existingRoleUser.name = name;
          await client.query('UPDATE app_users SET name = $1 WHERE id = $2', [name, existingRoleUser.id]);
        }

        return {
          id: existingRoleUser.id,
          email: existingRoleUser.email,
          phone: existingRoleUser.phone || undefined,
          name: existingRoleUser.name,
          role: existingRoleUser.role,
          specialistStatus: existingRoleUser.specialist_status || existingRoleUser.specialistStatus || 'not_requested',
          isNewUser: false,
          photoUrl: existingRoleUser.photo_url || existingRoleUser.photoUrl || undefined,
          verificationDocuments: typeof existingRoleUser.verification_documents === 'string' ? JSON.parse(existingRoleUser.verification_documents) : existingRoleUser.verification_documents || [],
          categories: existingRoleUser.categories || [],
          languages: typeof existingRoleUser.languages === 'string' ? JSON.parse(existingRoleUser.languages) : existingRoleUser.languages || [],
          tradeSkillLevel: existingRoleUser.trade_skill_level || existingRoleUser.tradeSkillLevel || undefined,
          skillsDescription: existingRoleUser.skills_description || existingRoleUser.skillsDescription || undefined,
          specialtiesWithLevels: typeof existingRoleUser.specialties_with_levels === 'string' ? JSON.parse(existingRoleUser.specialties_with_levels) : existingRoleUser.specialtiesWithLevels || [],
          city: existingRoleUser.city || undefined,
          region: existingRoleUser.region || undefined,
          dashboardNumber: existingRoleUser.dashboard_number || existingRoleUser.dashboardNumber || undefined,
          isBlocked: existingRoleUser.is_blocked || existingRoleUser.isBlocked || false,
        };
      } else {
        if (['operator', 'regional_admin'].includes(targetRole)) {
          return { error: `Access denied. No partner account found for ${userEmail}. Please contact Super Admin.` };
        }

        const specialistStatus = targetRole === 'specialist' ? 'approved' : 'not_requested';
        const userId = `user-${targetRole}-${Date.now()}`;

        const newUser = {
          id: userId,
          email: userEmail,
          phone: normalizedPhone || '',
          name: name || (normalizedEmail && normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : 'User'),
          role: targetRole,
          specialistStatus,
          password: password || null,
        };

        await client.query(
          `INSERT INTO app_users (id, email, phone, name, role, specialist_status, password) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET email = $2, phone = $3, name = $4, role = $5, specialist_status = $6`,
          [newUser.id, newUser.email, newUser.phone, newUser.name, newUser.role, newUser.specialistStatus, newUser.password]
        );

        if (targetRole === 'specialist') {
          await client.query(
            `INSERT INTO specialists (id, name, phone, category, city, balance, status) 
             VALUES ($1, $2, $3, $4, $5, 100, $6) 
             ON CONFLICT (id) DO UPDATE SET name = $2, phone = $3, status = $6`,
            [newUser.id, newUser.name, newUser.phone || '', 'Home Services', 'Portimão', 'approved']
          );
        }

        return {
          id: newUser.id,
          email: newUser.email,
          phone: newUser.phone || undefined,
          name: newUser.name,
          role: newUser.role,
          specialistStatus: newUser.specialistStatus,
          isNewUser: true,
          photoUrl: undefined,
          verificationDocuments: [],
          categories: [],
          languages: [],
        };
      }
    } catch (err) {
      console.error('Error during Neon DB auth (falling back to in-memory):', err);
    } finally {
      if (client) {
        try { client.release(); } catch (e) { /* ignore release error */ }
      }
    }
  }

  // Fallback Store Authentication (In-Memory)
  if (targetRole === 'super_admin') {
    let superUser = inMemoryUsers.find(u => u.role === 'super_admin' || (u.email && u.email.toLowerCase() === normalizedEmail.toLowerCase()));
    if (!superUser) {
      superUser = {
        id: 'user-super-01',
        email: normalizedEmail,
        phone: normalizedPhone || '+351 901 000 000',
        name: name || 'Oleg (Territorial Partner)',
        role: 'super_admin',
        dashboardNumber: '01',
        photoUrl: '/portimao_tp.jpg',
        city: 'Portimão',
        region: 'Algarve'
      };
      inMemoryUsers.push(superUser);
    }
    return {
      ...superUser,
      isNewUser: false
    };
  }

  const existingRoleUser = inMemoryUsers.find(
    (u) => u.role === targetRole && (
      (normalizedPhone && u.phone === normalizedPhone) ||
      (normalizedEmail && u.email && u.email.trim().toLowerCase() === normalizedEmail.toLowerCase())
    )
  );

  if (existingRoleUser) {
    if (existingRoleUser.isBlocked) {
      return { error: 'Access denied. Your account is blocked. Please contact support.' };
    }
    if ((targetRole === 'operator' || targetRole === 'regional_admin') && existingRoleUser.dashboardNumber && dashboardNumber && existingRoleUser.dashboardNumber !== dashboardNumber) {
      return { error: 'Invalid Dashboard Number.' };
    }
    return {
      ...existingRoleUser,
      isNewUser: false
    };
  }

  if (['operator', 'regional_admin'].includes(targetRole)) {
    return { error: `Access denied. No partner account found for ${userEmail}. Please contact Super Admin.` };
  }

  const newUser = {
    id: `user-${targetRole}-${Date.now()}`,
    email: userEmail,
    phone: normalizedPhone || '',
    name: name || (normalizedEmail && normalizedEmail.includes('@') ? normalizedEmail.split('@')[0] : 'User'),
    role: targetRole,
    password: password || undefined,
    specialistStatus: targetRole === 'specialist' ? 'approved' : 'not_requested',
  };
  inMemoryUsers.push(newUser);

  if (targetRole === 'specialist') {
    const specObj = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone || '',
      category: 'Home Services',
      city: 'Portimão',
      balance: 100,
      unlockedJobs: [],
      status: 'approved'
    };
    if (!inMemorySpecialists.some(s => s.id === newUser.id)) {
      inMemorySpecialists.push(specObj);
    }
  }
  return {
    ...newUser,
    isNewUser: true
  };
}

// 3. User Authentication / Creation Route
app.get('/api/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || '107108300547-c42s30trn4g93c7qqmajb9amssd36dgh.apps.googleusercontent.com'
  });
});

const failedAttempts = new Map<string, { count: number, lastAttempt: number }>();

app.post('/api/auth', async (req, res) => {
  try {
    const { email, phone, name, role, password, dashboardNumber, isRegistration } = req.body;
    const identifier = (email || phone || '').toLowerCase().trim();
    
    // Check rate limit delay
    const attemptInfo = failedAttempts.get(identifier);
    if (attemptInfo) {
      const timeSinceLast = Date.now() - attemptInfo.lastAttempt;
      const requiredDelay = Math.min(attemptInfo.count * 1000, 10000); // Max 10s delay
      if (timeSinceLast < requiredDelay) {
        await new Promise(resolve => setTimeout(resolve, requiredDelay - timeSinceLast));
      }
    }

    const userData = await authenticateOrRegisterUser(email, phone, name, role, password, dashboardNumber, isRegistration);
    
    if (userData.error) {
      // Increment failed attempt
      const newCount = (attemptInfo ? attemptInfo.count : 0) + 1;
      failedAttempts.set(identifier, { count: newCount, lastAttempt: Date.now() });
      return res.status(400).json(userData);
    }
    
    // Clear failed attempts on success
    failedAttempts.delete(identifier);
    
    // Attach signed auth token
    if (userData && userData.id) {
      userData.token = generateAuthToken(userData.id);
      delete userData.password;
    }

    res.json(userData);
  } catch (err: any) {
    console.error('Error in /api/auth handler:', err);
    res.status(400).json({ error: err.message || 'Authentication failed on server' });
  }
});

// 3b. Google OAuth Endpoints
app.get('/api/auth/google/url', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ 
      error: 'Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not configured yet. Please add them in Secrets or environment variables.' 
    });
  }

  const redirectUri = getGoogleRedirectUri(req);
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
    access_type: 'offline',
    prompt: 'consent',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error || !code) {
    const errorMsg = error || 'Authorization code missing';
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Google Authentication Failed</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h3 style="color: #dc2626;">Google Authentication Failed</h3>
        <p>${errorMsg}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 3000);
          }
        </script>
      </body>
      </html>
    `);
  }

  try {
    const redirectUri = getGoogleRedirectUri(req);
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token');
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userResponse.json();

    if (!userResponse.ok || !googleUser.email) {
      throw new Error('Failed to retrieve user profile from Google');
    }

    // Authenticate or register in app database
    const appUser = await authenticateOrRegisterUser(googleUser.email, '', googleUser.name || googleUser.email.split('@')[0]);
    if (appUser && appUser.id) {
      appUser.token = generateAuthToken(appUser.id);
      delete appUser.password;
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Authentication Success</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center; background: #0f172a; color: #f8fafc;">
        <h3>Signed in successfully!</h3>
        <p>Returning to app...</p>
        <script>
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(appUser)} }, '*');
            window.close();
          } else {
            try {
              const storedKey = 'nordbase_work_state_v2';
              const stored = localStorage.getItem(storedKey);
              let state = stored ? JSON.parse(stored) : {};
              state.currentUser = ${JSON.stringify(appUser)};
              if (!state.users) state.users = [];
              if (!state.users.some(u => u.id === state.currentUser.id || u.email === state.currentUser.email)) {
                state.users.push(state.currentUser);
              }
              localStorage.setItem(storedKey, JSON.stringify(state));
            } catch(e) { console.error(e); }
            window.location.href = '/?auth=success';
          }
        </script>
      </body>
      </html>
    `);
  } catch (err: any) {
    const errorMsg = err.message || 'Error processing Google callback';
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Google Authentication Error</title></head>
      <body style="font-family: sans-serif; padding: 20px; text-align: center; background: #0f172a; color: #f8fafc;">
        <h3 style="color: #ef4444;">Authentication Error</h3>
        <p>${errorMsg}</p>
        <script>
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
            setTimeout(() => window.close(), 3000);
          } else {
            setTimeout(() => window.location.href = '/?auth=error', 3000);
          }
        </script>
      </body>
      </html>
    `);
  }
});

// 4. Onboard User / Setup Specialist Profile

app.post('/api/users/update', verifyAuthToken, async (req, res) => {
  try {
    const caller = (req as AuthenticatedRequest).authenticatedUser!;
    const { users } = req.body;
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // RBAC & Ownership Validation
    for (const u of users) {
      if (!u || !u.id) continue;

      if (caller.role === 'customer' || caller.role === 'specialist' || caller.role === 'operator') {
        if (u.id !== caller.id) {
          return res.status(403).json({ error: 'Forbidden: You can only update your own user record.' });
        }
        // Preserve caller's existing trusted role and administrative flags
        u.role = caller.role;
        u.isBlocked = false;
        u.dashboardNumber = caller.dashboardNumber || null;
        u.region = caller.region || null;
      } else if (caller.role === 'regional_admin') {
        if (u.role === 'super_admin') {
          return res.status(403).json({ error: 'Forbidden: Cannot assign Super Admin role.' });
        }
        if (u.id !== caller.id) {
          const target = await findUserById(u.id);
          if (target && target.role === 'super_admin') {
            return res.status(403).json({ error: 'Forbidden: Cannot modify Super Admin accounts.' });
          }
          if (caller.region && target && target.region && target.region !== caller.region) {
            return res.status(403).json({ error: 'Forbidden: User outside assigned region.' });
          }
        }
      }
    }
    
    const cleanUsers = users.map(u => {
      const copy = { ...u };
      delete copy.balance;
      delete copy.amount;
      delete copy.leadPrice;
      delete copy.finalPrice;
      return {
        ...copy,
        email: (copy.email || '').trim().toLowerCase(),
        phone: (copy.phone || '').trim()
      };
    });

    // Always keep inMemoryUsers cache updated
    cleanUsers.forEach(u => {
      const foundIndex = inMemoryUsers.findIndex(x => x.id === u.id);
      if (foundIndex !== -1) {
        inMemoryUsers[foundIndex] = { ...inMemoryUsers[foundIndex], ...u };
      } else {
        inMemoryUsers.push(u);
      }
    });

      if (pool) {
        const client = await pool.connect();
        try {
          for (const u of cleanUsers) {
            try {
              // Check if user exists
              const res = await client.query('SELECT id FROM app_users WHERE id = $1', [u.id]);
              if (res.rows.length > 0) {
                // Update
                await client.query(
                  `UPDATE app_users 
                   SET is_blocked = $1, dashboard_number = $2, name = $3, phone = $4, email = $5, role = $6, password = $7, region = $8
                   WHERE id = $9`,
                  [u.isBlocked || false, u.dashboardNumber || null, u.name || '', u.phone || '', u.email || '', u.role || 'customer', u.password || null, u.region || null, u.id]
                );
              } else {
                // Insert
                await client.query(
                  `INSERT INTO app_users (id, email, phone, name, role, specialist_status, dashboard_number, password, is_blocked, region)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                  [u.id, u.email || '', u.phone || '', u.name || '', u.role || 'customer', u.specialistStatus || 'not_requested', u.dashboardNumber || null, u.password || null, u.isBlocked || false, u.region || null]
                );
              }
            } catch (rowErr) {
              console.error(`Error saving user ${u.email} (${u.id}):`, rowErr);
              // Continue with other users
            }
          }
        } finally {
          client.release();
        }
      }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating users:', err);
    res.status(500).json({ error: 'Failed to update users' });
  }
});

// Endpoint to permanently delete a user profile
app.delete('/api/users/:id', verifyAuthToken, async (req, res) => {
  try {
    const caller = (req as AuthenticatedRequest).authenticatedUser!;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (caller.role === 'customer' || caller.role === 'specialist' || caller.role === 'operator') {
      return res.status(403).json({ error: 'Forbidden: Standard users cannot delete user accounts.' });
    }

    if (caller.role === 'regional_admin') {
      const targetUser = await findUserById(id);
      if (!targetUser) return res.status(404).json({ error: 'User not found' });
      if (targetUser.role === 'super_admin') {
        return res.status(403).json({ error: 'Forbidden: Cannot delete Super Admin' });
      }
      if (caller.region && targetUser.region && targetUser.region !== caller.region) {
        return res.status(403).json({ error: 'Forbidden: Cannot delete user outside your region' });
      }
    }

    // Delete from in-memory arrays
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== id);
    inMemorySpecialists = inMemorySpecialists.filter(s => s.id !== id);
    inMemoryJobs = inMemoryJobs.filter(j => j.customerId !== id && j.assignedSpecialistId !== id);

    if (pool) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('DELETE FROM app_users WHERE id = $1', [id]);
        await client.query('DELETE FROM specialists WHERE id = $1', [id]);
        await client.query('DELETE FROM jobs WHERE customer_id = $1 OR specialist_id = $1', [id]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting user from DB:', err);
      } finally {
        client.release();
      }
    }

    res.json({ success: true, message: `User ${id} deleted successfully.` });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.post('/api/onboard', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { 
    userId, 
    role, 
    name, 
    phone, 
    city, 
    category,
    categories,
    languages,
    tradeSkillLevel,
    skillsDescription,
    photoUrl,
    verificationDocuments,
    specialtiesWithLevels
  } = req.body;

  // Ownership check: Normal users can only onboard themselves
  if (caller.role === 'customer' || caller.role === 'specialist' || caller.role === 'operator') {
    if (userId && userId !== caller.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot onboard another user ID.' });
    }
  }

  // Self-assignment of privileged roles is forbidden
  if (['super_admin', 'regional_admin', 'operator'].includes(role)) {
    if (caller.role !== 'super_admin' && caller.role !== 'regional_admin') {
      return res.status(403).json({ error: 'Forbidden: Self-assigning privileged roles is forbidden.' });
    }
  }

  const effectiveUserId = (caller.role === 'super_admin' || caller.role === 'regional_admin') && userId ? userId : caller.id;
  const effectiveRole = role || caller.role;

  if (pool) {
    let client;
    try {
      client = await pool.connect();
      
      // Get current user specialist_status first
      const userRes = await client.query('SELECT specialist_status FROM app_users WHERE id = $1', [effectiveUserId]);
      const currentStatus = userRes.rows[0]?.specialist_status;
      
      let specialistStatus = 'not_requested';
      if (effectiveRole === 'specialist') {
        specialistStatus = 'approved';
      }

      const safeCategory = category || (categories && categories[0]) || 'Home Services';
      const safeCity = city || 'Faro';
      const safeName = name || 'Specialist';
      const safePhone = phone || '';

      await client.query(
        `INSERT INTO app_users (id, email, phone, name, role, specialist_status, city, category, photo_url, verification_documents, categories, languages, trade_skill_level, skills_description, specialties_with_levels)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE 
         SET role = $5, name = $4, phone = $3, specialist_status = $6, city = $7, category = $8,
             photo_url = $9, verification_documents = $10, categories = $11, languages = $12,
             trade_skill_level = $13, skills_description = $14, specialties_with_levels = $15`,
         [
           effectiveUserId,
           `${effectiveUserId}@nordbase.pt`,
           safePhone,
           safeName,
           effectiveRole, 
           specialistStatus, 
           safeCity, 
           safeCategory, 
           photoUrl || null, 
           JSON.stringify(verificationDocuments || []), 
           categories || [], 
           JSON.stringify(languages || []), 
           tradeSkillLevel || null, 
           skillsDescription || null, 
           JSON.stringify(specialtiesWithLevels || [])
         ]
      );

      // If they onboard as specialist, add to specialists table
      if (effectiveRole === 'specialist') {
        await client.query(
          `INSERT INTO specialists (id, name, phone, category, city, balance, unlocked_jobs, 
                                    photo_url, verification_documents, categories, languages, 
                                    trade_skill_level, skills_description, status, specialties_with_levels) 
           VALUES ($1, $2, $3, $4, $5, 100, '{}', $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO UPDATE 
           SET name = $2, phone = $3, category = $4, city = $5, 
               photo_url = $6, verification_documents = $7, categories = $8, languages = $9, 
               trade_skill_level = $10, skills_description = $11, status = $12, specialties_with_levels = $13`,
          [
            effectiveUserId, 
            safeName, 
            safePhone, 
            safeCategory, 
            safeCity, 
            photoUrl || null, 
            JSON.stringify(verificationDocuments || []), 
            categories || [], 
            JSON.stringify(languages || []), 
            tradeSkillLevel || null, 
            skillsDescription || null,
            specialistStatus,
            JSON.stringify(specialtiesWithLevels || [])
          ]
        );
      }
    } catch (err) {
      console.error('Error during Neon onboarding DB query:', err);
    } finally {
      if (client) client.release();
    }
  }

  // Fallback in-memory onboard (always executes or supplements DB)
  let u = inMemoryUsers.find(usr => usr.id === effectiveUserId) as any;
  if (!u) {
    u = {
      id: effectiveUserId,
      email: `${effectiveUserId}@nordbase.pt`,
      role: effectiveRole,
      name,
      phone,
      specialistStatus: effectiveRole === 'specialist' ? 'approved' : 'not_requested'
    };
    inMemoryUsers.push(u);
  }
  u.role = effectiveRole;
  u.name = name;
  u.phone = phone;
  if (effectiveRole === 'specialist') {
    u.specialistStatus = 'approved';
  } else {
    u.specialistStatus = 'not_requested';
  }
  u.city = city;
  u.category = category;
  u.categories = categories;
  u.languages = languages;
  u.tradeSkillLevel = tradeSkillLevel;
  u.skillsDescription = skillsDescription;
  u.photoUrl = photoUrl;
  u.verificationDocuments = verificationDocuments;
  u.specialtiesWithLevels = specialtiesWithLevels;

  if (effectiveRole === 'specialist') {
    const exists = inMemorySpecialists.some((s: any) => s.id === effectiveUserId);
    if (!exists) {
      inMemorySpecialists.push({
        id: effectiveUserId,
        name,
        phone,
        category,
        city,
        balance: 100,
        unlockedJobs: [],
        status: u.specialistStatus,
        categories,
        languages,
        tradeSkillLevel,
        skillsDescription,
        photoUrl,
        verificationDocuments,
        specialtiesWithLevels
      } as any);
    } else {
      const idx = inMemorySpecialists.findIndex((s: any) => s.id === effectiveUserId);
      if (idx !== -1) {
        inMemorySpecialists[idx] = {
          ...inMemorySpecialists[idx],
          name,
          phone,
          category,
          city,
          categories,
          languages,
          tradeSkillLevel,
          skillsDescription,
          photoUrl,
          verificationDocuments,
          status: u.specialistStatus,
          specialtiesWithLevels
        } as any;
      }
    }
  }

  res.json({ success: true });
});

// 4b. Update User Photo
app.post('/api/user/update-photo', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { userId, photoUrl } = req.body;
  const targetUserId = (caller.role === 'super_admin' || caller.role === 'regional_admin') && userId ? userId : caller.id;

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `UPDATE app_users SET photo_url = $1 WHERE id = $2`,
        [photoUrl || null, targetUserId]
      );
      // Also update in specialists table if exists
      await client.query(
        `UPDATE specialists SET photo_url = $1 WHERE id = $2`,
        [photoUrl || null, targetUserId]
      );
      client.release();
    } catch (err) {
      console.error('Error updating user photo in Neon DB:', err);
    }
  }

  // Update in-memory caches
  const u = inMemoryUsers.find(usr => usr.id === targetUserId);
  if (u) {
    u.photoUrl = photoUrl;
  }
  const s = inMemorySpecialists.find(spec => spec.id === targetUserId);
  if (s) {
    s.photoUrl = photoUrl;
  }

  res.json({ success: true });
});

// 5. Create Job
app.post('/api/jobs', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'create_job') {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  const { category, city, specificLocation, description, customerName, customerPhone, attachments, operatorId, hubId } = req.body;

  let finalCustomerName = customerName;
  let finalCustomerPhone = customerPhone;
  let finalCustomerId = caller.id;

  if (caller.role === 'customer') {
    finalCustomerName = caller.name || customerName || caller.email.split('@')[0];
    finalCustomerPhone = caller.phone || customerPhone || '';
    finalCustomerId = caller.id;
  }

  // Duplicate Check: Prevents identical job creation within a 60-second window by the same customer
  if (pool) {
    try {
      const client = await pool.connect();
      const duplicateRes = await client.query(
        `SELECT * FROM jobs 
         WHERE customer_id = $1 
           AND category = $2 
           AND city = $3 
           AND description = $4 
           AND created_at >= NOW() - INTERVAL '60 seconds'
         ORDER BY created_at DESC LIMIT 1`,
        [finalCustomerId, category, city, description]
      );
      client.release();
      if (duplicateRes.rows.length > 0) {
        const dupJob = duplicateRes.rows[0];
        const formattedDup = {
          id: dupJob.id,
          category: dupJob.category,
          city: dupJob.city,
          specificLocation: dupJob.specific_location,
          description: dupJob.description,
          estimatedHours: parseFloat(dupJob.estimated_hours || '1'),
          estimatedValue: parseFloat(dupJob.estimated_value || '0'),
          leadPrice: parseFloat(dupJob.lead_price || '0'),
          status: dupJob.status,
          createdAt: new Date(dupJob.created_at).toISOString(),
          customerName: dupJob.customer_name,
          customerPhone: dupJob.customer_phone,
          customerId: dupJob.customer_id,
          unlockedBySpecialistId: dupJob.unlocked_by_specialist_id || null,
          coordinatorId: dupJob.coordinator_id || null,
          hubId: dupJob.hub_id || null,
          coordinatorNotes: dupJob.coordinator_notes || '',
          attachments: dupJob.attachments || [],
          messages: typeof dupJob.messages === 'string' ? JSON.parse(dupJob.messages) : (dupJob.messages || [])
        };
        if (idempotencyKey) {
          await saveIdempotencyRecord(caller.id, idempotencyKey, 'create_job', formattedDup.id, 200, formattedDup);
        }
        return res.json(formattedDup);
      }
    } catch (err) {
      console.error('Error checking duplicate job in DB:', err);
    }
  } else {
    const sixtySecsAgo = Date.now() - 60000;
    const existingDup = inMemoryJobs.find(j => 
      j.customerId === finalCustomerId &&
      j.category === category &&
      j.city === city &&
      j.description === description &&
      new Date(j.createdAt).getTime() >= sixtySecsAgo
    );
    if (existingDup) {
      if (idempotencyKey) {
        await saveIdempotencyRecord(caller.id, idempotencyKey, 'create_job', existingDup.id, 200, existingDup);
      }
      return res.json(existingDup);
    }
  }

  const newJob = {
    id: `job-${Date.now()}`,
    category,
    city,
    specificLocation,
    description,
    estimatedHours: 1,
    estimatedValue: 0,
    leadPrice: 0,
    status: 'pending_coordinator',
    createdAt: new Date().toISOString(),
    customerName: finalCustomerName,
    customerPhone: finalCustomerPhone,
    customerId: finalCustomerId,
    unlockedBySpecialistId: null,
    coordinatorId: operatorId || null,
    hubId: hubId || null,
    coordinatorNotes: '',
    attachments: attachments || [],
    messages: []
  };

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query(
        `INSERT INTO jobs (id, category, city, specific_location, description, estimated_hours, estimated_value, lead_price, status, created_at, customer_name, customer_phone, unlocked_by_specialist_id, coordinator_id, coordinator_notes, hub_id, attachments, messages, customer_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          newJob.id,
          newJob.category,
          newJob.city,
          newJob.specificLocation,
          newJob.description,
          newJob.estimatedHours,
          newJob.estimatedValue,
          newJob.leadPrice,
          newJob.status,
          newJob.createdAt,
          newJob.customerName,
          newJob.customerPhone,
          newJob.unlockedBySpecialistId,
          newJob.coordinatorId,
          newJob.coordinatorNotes,
          newJob.hubId || null,
          newJob.attachments,
          JSON.stringify(newJob.messages),
          newJob.customerId
        ]
      );
      client.release();
    } catch (err) {
      console.error('Error saving job to Neon:', err);
    }
  }

  inMemoryJobs.unshift(newJob);
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'create_job', newJob.id, 200, newJob);
  }
  return res.json(newJob);
});

// Helper function for Atomic Lead Unlock
async function performAtomicLeadUnlock(
  jobId: string,
  requestedSpecialistId: string | undefined,
  caller: User,
  res: express.Response,
  req?: express.Request
) {
  const idempotencyKey = req ? extractIdempotencyKey(req) : null;

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'unlock_lead' || existingRecord.resourceId !== jobId) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }
  // 1. Identity & Role Validation
  let targetSpecialistId = '';
  if (caller.role === 'specialist') {
    targetSpecialistId = caller.id;
  } else if (caller.role === 'super_admin' || caller.role === 'regional_admin' || caller.role === 'operator') {
    if (!requestedSpecialistId) {
      return res.status(400).json({ error: 'Specialist ID required when unlocking lead', code: 'SPECIALIST_ID_REQUIRED' });
    }
    targetSpecialistId = requestedSpecialistId;
  } else {
    return res.status(403).json({ error: 'Forbidden: Only specialists or authorized operators can unlock leads', code: 'FORBIDDEN_ROLE' });
  }

  if (caller.isBlocked) {
    return res.status(403).json({ error: 'Forbidden: Account is blocked', code: 'ACCOUNT_BLOCKED' });
  }

  // 2. Fail safely if database is unavailable (Step 15)
  if (!pool) {
    return res.status(503).json({
      error: 'Database unavailable. Financial operations require persistent database connectivity.',
      code: 'DATABASE_UNAVAILABLE'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step A: Lock Job Row
    const jobRes = await client.query(
      'SELECT * FROM jobs WHERE id = $1 FOR UPDATE',
      [jobId]
    );

    if (jobRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
    }

    const job = jobRes.rows[0];

    // Step B: Double Unlock Protection & Concurrency Check
    // Check 1: Ledger transaction table
    const existingTxRes = await client.query(
      'SELECT * FROM lead_unlock_transactions WHERE job_id = $1',
      [jobId]
    );
    if (existingTxRes.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(409).json({
        error: 'Lead already unlocked by a specialist',
        code: 'LEAD_ALREADY_UNLOCKED'
      });
    }

    // Check 2: Active or Completed status
    if (job.status === 'active' || job.status === 'completed') {
      await client.query('ROLLBACK');
      client.release();
      return res.status(409).json({
        error: 'Lead already unlocked or completed',
        code: 'LEAD_ALREADY_UNLOCKED'
      });
    }

    // Check 3: Unlocked by another specialist
    if (job.unlocked_by_specialist_id && job.unlocked_by_specialist_id !== targetSpecialistId) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(409).json({
        error: 'Lead already assigned to another specialist',
        code: 'LEAD_ALREADY_UNLOCKED'
      });
    }

    // Check 4: Closed or cancelled job
    if (job.status === 'cancelled') {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ error: 'Job is cancelled', code: 'JOB_CLOSED' });
    }

    // Check 5: Pending operator review (not yet offered or selected)
    if (job.status === 'pending_operator') {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ error: 'Lead cannot be unlocked before operator review and price calculation', code: 'INVALID_JOB_STATE' });
    }

    // Step C: Lock Specialist Row
    const specRes = await client.query(
      'SELECT * FROM specialists WHERE id = $1 FOR UPDATE',
      [targetSpecialistId]
    );

    if (specRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ error: 'Specialist profile not found', code: 'SPECIALIST_NOT_FOUND' });
    }

    const specialist = specRes.rows[0];

    if (specialist.status === 'blocked' || specialist.is_blocked) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(403).json({ error: 'Specialist account is blocked', code: 'ACCOUNT_BLOCKED' });
    }

    // Step D: Server-Side Lead Price & Balance Validation
    // Authoritative lead price MUST come directly from database record!
    const leadPrice = parseFloat(job.lead_price || '0');
    const specBalance = parseFloat(specialist.balance || '0');

    if (specBalance < leadPrice) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(402).json({
        error: 'Insufficient specialist balance to unlock lead',
        code: 'INSUFFICIENT_BALANCE',
        currentBalance: specBalance,
        requiredPrice: leadPrice
      });
    }

    // Step E: Deduct Balance & Append Unlocked Job
    const newBalance = specBalance - leadPrice;
    await client.query(
      `UPDATE specialists 
       SET balance = $1, unlocked_jobs = array_append(unlocked_jobs, $2) 
       WHERE id = $3`,
      [newBalance, jobId, targetSpecialistId]
    );

    // Step F: Assign Lead & Update Status
    await client.query(
      `UPDATE jobs 
       SET status = 'active', unlocked_by_specialist_id = $1 
       WHERE id = $2`,
      [targetSpecialistId, jobId]
    );

    // Step G: Insert Ledger Transaction Record
    const txId = `tx_unlock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await client.query(
      `INSERT INTO lead_unlock_transactions (id, job_id, specialist_id, amount, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [txId, jobId, targetSpecialistId, leadPrice]
    );

    // Step H: Insert System and Specialist Intro Messages
    const existingMsgs = typeof job.messages === 'string' ? JSON.parse(job.messages) : (job.messages || []);
    const newMsgs = [
      ...existingMsgs,
      {
        id: `msg-${Date.now()}-sys-unlock`,
        sender: 'system',
        senderName: 'System',
        content: `Job unlocked by Specialist ${specialist.name}. Connection active.`,
        timestamp: new Date().toISOString(),
      },
      {
        id: `msg-${Date.now()}-spec-intro`,
        sender: 'specialist',
        senderName: specialist.name,
        content: `Hello! I have unlocked your job through NordBase.pt. Let me coordinate the timing with you.`,
        timestamp: new Date().toISOString(),
      }
    ];

    await client.query(
      `UPDATE jobs SET messages = $1 WHERE id = $2`,
      [JSON.stringify(newMsgs), jobId]
    );

    // Step I: Commit Transaction
    await client.query('COMMIT');
    client.release();

    // Sync in-memory state with the committed database update
    const inMemJob = inMemoryJobs.find(j => j.id === jobId);
    if (inMemJob) {
      inMemJob.status = 'active';
      inMemJob.unlockedBySpecialistId = targetSpecialistId;
      inMemJob.messages = newMsgs;
    }
    const inMemSpec = inMemorySpecialists.find(s => s.id === targetSpecialistId);
    if (inMemSpec) {
      inMemSpec.balance = newBalance;
      if (!inMemSpec.unlockedJobs) inMemSpec.unlockedJobs = [];
      if (!inMemSpec.unlockedJobs.includes(jobId)) {
        inMemSpec.unlockedJobs.push(jobId);
      }
    }

    const successResponse = {
      success: true,
      jobId,
      specialistId: targetSpecialistId,
      leadPriceDeducted: leadPrice,
      remainingBalance: newBalance,
      transactionId: txId
    };

    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'unlock_lead', jobId, 200, successResponse);
    }

    return res.json(successResponse);

  } catch (err) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Error during atomic lead unlock:', err);
    return res.status(500).json({ error: 'Database transaction error during lead unlock', code: 'TRANSACTION_ERROR' });
  }
}

// Dedicated Single Authoritative Lead Unlock Endpoint (Step 2)
app.post('/api/jobs/:id/unlock', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const requestedSpecialistId = req.body.specialistId || req.body.unlockedBySpecialistId;
  return performAtomicLeadUnlock(id, requestedSpecialistId, caller, res, req);
});

// FIX 4: Customer Completion Endpoint
app.post('/api/jobs/:id/customer-completion', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'customer_completion' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  if (caller.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden: Only customers can submit customer completion sign-off', code: 'FORBIDDEN_ROLE' });
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  // Verify Customer ownership
  const isOwner = (existingJob.customerId && existingJob.customerId === caller.id) ||
                  (existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone) ||
                  (existingJob.customerName && caller.name && existingJob.customerName === caller.name);
  if (!isOwner) {
    return res.status(403).json({ error: 'Forbidden: You are not the customer associated with this job request.', code: 'NOT_JOB_OWNER' });
  }

  // Job status must be 'active'
  if (existingJob.status !== 'active') {
    return res.status(409).json({ error: `Customer completion can only be submitted for active jobs. Current status: ${existingJob.status}`, code: 'INVALID_JOB_STATE' });
  }

  // Validate mandatory confirmations
  const { orderCompleted, noClaims, paymentMade, rating, positiveTags, customerComment } = req.body;
  if (orderCompleted !== true || noClaims !== true || paymentMade !== true) {
    return res.status(400).json({
      error: 'All three customer completion conditions must be explicitly true: orderCompleted, noClaims, paymentMade',
      code: 'MISSING_CONFIRMATION_FLAGS'
    });
  }

  // Idempotency: If already confirmed by customer, return success without duplicate side-effects
  if (existingJob.customerCompleted) {
    const alreadyResp = {
      success: true,
      alreadyConfirmed: true,
      customerCompleted: true,
      confirmedAt: existingJob.customerCompletedAt
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'customer_completion', id, 200, alreadyResp);
    }
    return res.json(alreadyResp);
  }

  const nowIso = new Date().toISOString();
  const completionData = {
    confirmed: true,
    orderCompleted: true,
    noClaims: true,
    paymentMade: true,
    confirmedAt: nowIso
  };

  const ratingNum = rating !== undefined ? parseFloat(rating) : undefined;
  const tagsArr = Array.isArray(positiveTags) ? positiveTags : [];
  const commentStr = typeof customerComment === 'string' ? customerComment : undefined;

  // Append system message
  const ratingText = ratingNum ? ` Rated: ${ratingNum}⭐` : '';
  const tagText = tagsArr.length > 0 ? ` (${tagsArr.join(', ')})` : '';
  const commentMsg = commentStr ? ` Comment: "${commentStr}"` : '';
  const newMsg = {
    id: `msg-${Date.now()}-cust-done`,
    sender: 'system',
    senderName: 'System',
    content: `Customer confirmed job completion: "Work completed, no disputes".${ratingText}${tagText}${commentMsg}`,
    timestamp: nowIso
  };

  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      const isBothCompleted = existingJob.specialistCompleted === true;
      const newStatus = isBothCompleted ? 'completed' : 'active';

      await client.query(
        `UPDATE jobs 
         SET customer_completed = true, 
             customer_completed_at = $1, 
             customer_completion = $2,
             rating = $3,
             positive_tags = $4,
             customer_comment = $5,
             messages = $6,
             status = $7
         WHERE id = $8 AND (status = 'active' OR status = 'completed')`,
        [nowIso, JSON.stringify(completionData), ratingNum || null, tagsArr, commentStr || null, JSON.stringify(updatedMsgs), newStatus, id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error('Error updating customer completion in DB:', err);
      return res.status(500).json({ error: 'Database error updating customer completion' });
    }
  }

  // Update in-memory job if present
  existingJob.customerCompleted = true;
  existingJob.customerCompletedAt = nowIso;
  existingJob.customerCompletion = completionData;
  if (ratingNum) existingJob.rating = ratingNum;
  existingJob.positiveTags = tagsArr;
  if (commentStr) existingJob.customerComment = commentStr;
  if (existingJob.specialistCompleted) {
    existingJob.status = 'completed';
  }
  if (commentStr) existingJob.customerComment = commentStr;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const successResp = {
    success: true,
    customerCompleted: true,
    confirmedAt: nowIso
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'customer_completion', id, 200, successResp);
  }

  return res.json(successResp);
});

// FIX 4: Specialist Completion Endpoint
app.post('/api/jobs/:id/specialist-completion', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'specialist_completion' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  if (caller.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden: Only specialists can submit specialist completion sign-off', code: 'FORBIDDEN_ROLE' });
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  // Verify Specialist assignment
  if (existingJob.unlockedBySpecialistId !== caller.id) {
    return res.status(403).json({ error: 'Forbidden: You are not the specialist assigned to this job.', code: 'NOT_ASSIGNED_SPECIALIST' });
  }

  // Job status must be 'active'
  if (existingJob.status !== 'active') {
    return res.status(409).json({ error: `Specialist completion can only be submitted for active jobs. Current status: ${existingJob.status}`, code: 'INVALID_JOB_STATE' });
  }

  // Validate mandatory confirmations
  const { workCompleted, paymentReceived, noClaims } = req.body;
  if (workCompleted !== true || paymentReceived !== true || noClaims !== true) {
    return res.status(400).json({
      error: 'All three specialist completion conditions must be explicitly true: workCompleted, paymentReceived, noClaims',
      code: 'MISSING_CONFIRMATION_FLAGS'
    });
  }

  // Idempotency: If already confirmed by specialist, return success without duplicate side-effects
  if (existingJob.specialistCompleted) {
    const alreadyResp = {
      success: true,
      alreadyConfirmed: true,
      specialistCompleted: true,
      confirmedAt: existingJob.specialistCompletedAt
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'specialist_completion', id, 200, alreadyResp);
    }
    return res.json(alreadyResp);
  }

  const nowIso = new Date().toISOString();
  const completionData = {
    confirmed: true,
    workCompleted: true,
    paymentReceived: true,
    noClaims: true,
    confirmedAt: nowIso
  };

  const newMsg = {
    id: `msg-${Date.now()}-spec-done`,
    sender: 'system',
    senderName: 'System',
    content: `Specialist confirmed completion: "Work completed, payment received, no disputes".`,
    timestamp: nowIso
  };

  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      const isBothCompleted = existingJob.customerCompleted === true;
      const newStatus = isBothCompleted ? 'completed' : 'active';

      await client.query(
        `UPDATE jobs 
         SET specialist_completed = true, 
             specialist_completed_at = $1, 
             specialist_completion = $2,
             messages = $3,
             status = $4
         WHERE id = $5 AND (status = 'active' OR status = 'completed')`,
        [nowIso, JSON.stringify(completionData), JSON.stringify(updatedMsgs), newStatus, id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error('Error updating specialist completion in DB:', err);
      return res.status(500).json({ error: 'Database error updating specialist completion' });
    }
  }

  // Update in-memory job if present
  existingJob.specialistCompleted = true;
  existingJob.specialistCompletedAt = nowIso;
  existingJob.specialistCompletion = completionData;
  if (existingJob.customerCompleted) {
    existingJob.status = 'completed';
  }
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const successResp = {
    success: true,
    specialistCompleted: true,
    confirmedAt: nowIso
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'specialist_completion', id, 200, successResp);
  }

  return res.json(successResp);
});

// FIX 5: Price Assessment Proposal Endpoint (Specialist)
app.post('/api/jobs/:id/propose-price', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'propose_price' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  if (caller.role !== 'specialist') {
    return res.status(403).json({ error: 'Forbidden: Only specialists can propose revised job prices.', code: 'FORBIDDEN_ROLE' });
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  if (existingJob.unlockedBySpecialistId !== caller.id) {
    return res.status(403).json({ error: 'Forbidden: You are not the assigned specialist for this job.', code: 'NOT_ASSIGNED_SPECIALIST' });
  }

  if (existingJob.status !== 'active') {
    return res.status(409).json({ error: `Price proposals can only be submitted for active jobs. Current status: ${existingJob.status}`, code: 'INVALID_JOB_STATE' });
  }

  if (existingJob.customerPriceAccepted && existingJob.finalPrice) {
    return res.status(409).json({ error: 'Cannot propose a new price: Customer has already accepted the price for this job.', code: 'PRICE_ALREADY_ACCEPTED' });
  }

  const { proposedPrice } = req.body;
  const numericPrice = parseFloat(proposedPrice);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ error: 'Invalid proposed price: Must be a positive number.', code: 'INVALID_PROPOSED_PRICE' });
  }

  // Idempotency: If exact price was already proposed, return current state without duplicate messages
  if (existingJob.specialistAssessedValue === numericPrice) {
    const alreadyProposedResp = {
      success: true,
      jobId: id,
      proposedPrice: numericPrice,
      customerPriceAccepted: false,
      alreadyProposed: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'propose_price', id, 200, alreadyProposedResp);
    }
    return res.json(alreadyProposedResp);
  }

  const nowIso = new Date().toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-prop`,
    sender: 'system',
    senderName: 'System',
    content: `Specialist assessed job scope on-site and proposed revised price: €${numericPrice.toFixed(2)} (Initial estimate: €${existingJob.estimatedValue}). Awaiting customer confirmation.`,
    timestamp: nowIso
  };

  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      await client.query(
        `UPDATE jobs 
         SET specialist_assessed_value = $1, 
             customer_price_accepted = false, 
             messages = $2 
         WHERE id = $3 AND status = 'active'`,
        [numericPrice, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error('Error recording proposed price in DB:', err);
      return res.status(500).json({ error: 'Database error recording proposed price' });
    }
  }

  existingJob.specialistAssessedValue = numericPrice;
  existingJob.customerPriceAccepted = false;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const proposeResp = {
    success: true,
    jobId: id,
    proposedPrice: numericPrice,
    customerPriceAccepted: false
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'propose_price', id, 200, proposeResp);
  }

  return res.json(proposeResp);
});

// FIX 5: Price Acceptance Endpoint (Customer)
app.post('/api/jobs/:id/accept-price', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'accept_price' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  if (caller.role !== 'customer') {
    return res.status(403).json({ error: 'Forbidden: Only customers can accept revised job prices.', code: 'FORBIDDEN_ROLE' });
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  const isOwner = (existingJob.customerId && existingJob.customerId === caller.id) ||
                  (existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone) ||
                  (existingJob.customerName && caller.name && existingJob.customerName === caller.name);
  if (!isOwner) {
    return res.status(403).json({ error: 'Forbidden: You do not own this job request.', code: 'NOT_JOB_OWNER' });
  }

  if (existingJob.status !== 'active') {
    return res.status(409).json({ error: `Price acceptance can only occur for active jobs. Current status: ${existingJob.status}`, code: 'INVALID_JOB_STATE' });
  }

  // Idempotency: If customer already accepted price, return success without duplicate messages
  if (existingJob.customerPriceAccepted && existingJob.finalPrice) {
    const alreadyAcceptedResp = {
      success: true,
      jobId: id,
      finalPrice: existingJob.finalPrice,
      customerPriceAccepted: true,
      alreadyAccepted: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'accept_price', id, 200, alreadyAcceptedResp);
    }
    return res.json(alreadyAcceptedResp);
  }

  const acceptedPrice = existingJob.specialistAssessedValue;
  if (!acceptedPrice || acceptedPrice <= 0) {
    return res.status(400).json({ error: 'No revised price proposal exists for this job.', code: 'NO_PRICE_PROPOSAL' });
  }

  const nowIso = new Date().toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-acc`,
    sender: 'system',
    senderName: 'System',
    content: `Customer accepted the revised price of €${acceptedPrice.toFixed(2)}. Work may proceed according to updated scope.`,
    timestamp: nowIso
  };

  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      await client.query(
        `UPDATE jobs 
         SET customer_price_accepted = true, 
             final_price = $1, 
             messages = $2 
         WHERE id = $3 AND status = 'active'`,
        [acceptedPrice, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error('Error accepting price in DB:', err);
      return res.status(500).json({ error: 'Database error accepting proposed price' });
    }
  }

  existingJob.customerPriceAccepted = true;
  existingJob.finalPrice = acceptedPrice;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const acceptResp = {
    success: true,
    jobId: id,
    finalPrice: acceptedPrice,
    customerPriceAccepted: true
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'accept_price', id, 200, acceptResp);
  }

  return res.json(acceptResp);
});

// FIX 5: Price Refusal / Call-out Fee Endpoint
app.post('/api/jobs/:id/decline-price', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'decline_price' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  // Idempotency: If job is ALREADY cancelled, return status without duplicate side-effects
  if (existingJob.status === 'cancelled') {
    const alreadyDeclinedResp = {
      success: true,
      jobId: id,
      status: 'cancelled',
      calloutFeePending: existingJob.calloutFeePending || false,
      calloutFeeAmount: existingJob.calloutFeeAmount || 0,
      alreadyDeclined: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'decline_price', id, 200, alreadyDeclinedResp);
    }
    return res.json(alreadyDeclinedResp);
  }

  const isCustomerOwner = caller.role === 'customer' && (
    (existingJob.customerId && existingJob.customerId === caller.id) ||
    (existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone) ||
    (existingJob.customerName && caller.name && existingJob.customerName === caller.name)
  );
  const isAssignedSpecialist = caller.role === 'specialist' && existingJob.unlockedBySpecialistId === caller.id;

  if (!isCustomerOwner && !isAssignedSpecialist) {
    return res.status(403).json({ error: 'Forbidden: You are not authorized to decline price for this job.', code: 'UNAUTHORIZED_DECLINE' });
  }

  if (existingJob.status !== 'active') {
    return res.status(409).json({ error: `Price refusal can only be processed for active jobs. Current status: ${existingJob.status}`, code: 'INVALID_JOB_STATE' });
  }

  // Qualification check: Call-out fee applies ONLY if specialist conducted an on-site assessment (specialistAssessedValue set > 0)
  const hasOnSiteAssessment = existingJob.specialistAssessedValue !== undefined && existingJob.specialistAssessedValue > 0;
  const calloutFeePending = hasOnSiteAssessment;
  const calloutFeeAmount = hasOnSiteAssessment ? 20 : 0;

  const msgContent = hasOnSiteAssessment
    ? 'Customer declined revised price after on-site assessment. Job cancelled with standard €20 Call-out Fee pending for specialist travel/time.'
    : 'Customer cancelled order prior to on-site assessment. Order cancelled.';

  const nowIso = new Date().toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-price-dec`,
    sender: 'system',
    senderName: 'System',
    content: msgContent,
    timestamp: nowIso
  };

  if (pool) {
    const client = await pool.connect();
    try {
      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      await client.query(
        `UPDATE jobs 
         SET status = 'cancelled', 
             callout_fee_pending = $1, 
             callout_fee_amount = $2, 
             messages = $3 
         WHERE id = $4 AND status = 'active'`,
        [calloutFeePending, calloutFeeAmount, JSON.stringify(updatedMsgs), id]
      );
      client.release();
    } catch (err) {
      client.release();
      console.error('Error declining price in DB:', err);
      return res.status(500).json({ error: 'Database error declining proposed price' });
    }
  }

  existingJob.status = 'cancelled';
  existingJob.calloutFeePending = calloutFeePending;
  existingJob.calloutFeeAmount = calloutFeeAmount;
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const declineResp = {
    success: true,
    jobId: id,
    status: 'cancelled',
    calloutFeePending,
    calloutFeeAmount
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'decline_price', id, 200, declineResp);
  }

  return res.json(declineResp);
});

// FIX 4: Territory Partner Finalization Endpoint
app.post('/api/jobs/:id/complete', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'tp_complete' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  // 1. Role verification: Only operators / admins
  if (caller.role !== 'operator' && caller.role !== 'regional_admin' && caller.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Forbidden: Only Territory Partners and Administrators can finalize job completion.',
      code: 'FORBIDDEN_ROLE'
    });
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found', code: 'JOB_NOT_FOUND' });
  }

  // Idempotency: If job is ALREADY completed, return success without duplicate side-effects
  if (existingJob.status === 'completed') {
    const alreadyCompletedResp = {
      success: true,
      jobId: id,
      status: 'completed',
      alreadyCompleted: true
    };
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'tp_complete', id, 200, alreadyCompletedResp);
    }
    return res.json(alreadyCompletedResp);
  }

  // 2. Territory / Ownership verification
  if (caller.role === 'operator') {
    if (caller.dashboardNumber && existingJob.hubId && caller.dashboardNumber !== existingJob.hubId) {
      if (existingJob.coordinatorId && existingJob.coordinatorId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: You do not manage this territory/job.', code: 'UNAUTHORIZED_TERRITORY' });
      }
    }
  } else if (caller.role === 'regional_admin') {
    if (caller.region && existingJob.region && caller.region !== existingJob.region) {
      return res.status(403).json({ error: 'Forbidden: Job outside assigned region.', code: 'UNAUTHORIZED_REGION' });
    }
  }

  // 3. Job status must be 'active'
  if (existingJob.status !== 'active') {
    return res.status(409).json({
      error: `Job can only be finalized if current status is active. Current status: ${existingJob.status}`,
      code: 'INVALID_JOB_STATE'
    });
  }

  // 4. Verify BOTH Customer AND Specialist completions exist!
  if (!existingJob.customerCompleted) {
    return res.status(409).json({
      error: 'Cannot finalize job: Customer completion confirmation is missing.',
      code: 'MISSING_CUSTOMER_CONFIRMATION'
    });
  }

  if (!existingJob.specialistCompleted) {
    return res.status(409).json({
      error: 'Cannot finalize job: Specialist completion confirmation is missing.',
      code: 'MISSING_SPECIALIST_CONFIRMATION'
    });
  }

  const nowIso = new Date().toISOString();
  const newMsg = {
    id: `msg-${Date.now()}-sys-done`,
    sender: 'system',
    senderName: 'System',
    content: `Territory Partner has marked the job as COMPLETED. Thank you for using NordBase.pt!`,
    timestamp: nowIso
  };

  // 5. Atomic DB update with strict preconditions
  if (pool) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const msgsRes = await client.query('SELECT messages FROM jobs WHERE id = $1 FOR UPDATE', [id]);
      const currentMsgs = typeof msgsRes.rows[0]?.messages === 'string' ? JSON.parse(msgsRes.rows[0].messages) : (msgsRes.rows[0]?.messages || []);
      const updatedMsgs = [...currentMsgs, newMsg];

      const updateRes = await client.query(
        `UPDATE jobs
         SET status = 'completed',
             messages = $1
         WHERE id = $2
           AND status = 'active'
           AND customer_completed = true
           AND specialist_completed = true`,
        [JSON.stringify(updatedMsgs), id]
      );

      if (updateRes.rowCount === 0) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(409).json({
          error: 'Atomic completion failed: Job status was modified or confirmations were invalidated concurrently.',
          code: 'COMPLETION_PRECONDITION_FAILED'
        });
      }

      await client.query('COMMIT');
      client.release();
    } catch (err) {
      await client.query('ROLLBACK');
      client.release();
      console.error('Error during atomic job completion:', err);
      return res.status(500).json({ error: 'Database transaction error during job completion', code: 'TRANSACTION_ERROR' });
    }
  }

  // Update in-memory object
  existingJob.status = 'completed';
  if (!existingJob.messages) existingJob.messages = [];
  existingJob.messages.push(newMsg as any);

  const tpCompleteResp = {
    success: true,
    jobId: id,
    status: 'completed'
  };

  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'tp_complete', id, 200, tpCompleteResp);
  }

  return res.json(tpCompleteResp);
});

// 6. Update Job Status or Coordinator Details
app.post('/api/jobs/:id/update', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;

  // If request is setting status to active / unlocking lead, delegate to atomic unlock!
  if (req.body.status === 'active' && (caller.role === 'specialist' || req.body.unlockedBySpecialistId)) {
    return performAtomicLeadUnlock(id, req.body.unlockedBySpecialistId, caller, res);
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Safeguard: Prevent customers and specialists from setting status to completed directly
  if (req.body.status === 'completed') {
    if (caller.role === 'customer' || caller.role === 'specialist') {
      return res.status(403).json({
        error: 'Forbidden: Customers and Specialists cannot directly set job status to completed. Submit completion confirmation instead.',
        code: 'FORBIDDEN_DIRECT_COMPLETION'
      });
    }

    // Require both confirmations for operators/admins trying to mark completed
    if (!existingJob.customerCompleted || !existingJob.specialistCompleted) {
      return res.status(409).json({
        error: 'Cannot mark job as completed without both Customer and Specialist confirmations.',
        code: 'MISSING_PARTY_CONFIRMATIONS'
      });
    }

    if (existingJob.status !== 'active') {
      return res.status(409).json({
        error: `Only active jobs can be marked as completed. Current status: ${existingJob.status}`,
        code: 'INVALID_JOB_STATE'
      });
    }
  }

  // Safeguard: Completed or cancelled state immutability
  if (existingJob.status === 'completed' && req.body.status && req.body.status !== 'completed') {
    return res.status(409).json({
      error: 'Completed jobs cannot be reopened or changed to prior states.',
      code: 'COMPLETED_JOB_IMMUTABLE'
    });
  }

  if (existingJob.status === 'cancelled' && req.body.status === 'completed') {
    return res.status(409).json({
      error: 'Cancelled jobs cannot be marked as completed.',
      code: 'INVALID_JOB_STATE'
    });
  }

  // Financial parameter stripping for non-admin roles (Customers & Specialists)
  if (caller.role === 'customer' || caller.role === 'specialist') {
    delete req.body.leadPrice;
    delete req.body.estimatedValue;
    delete req.body.estimatedHours;
    delete req.body.specialistAssessedValue;
    delete req.body.finalPrice;
    delete req.body.calloutFeeAmount;
    delete req.body.calloutFeePending;
    delete req.body.balance;
    delete req.body.amount;
    delete req.body.unlockedBySpecialistId;
  }

  // CLOSED JOB FINANCIAL IMMUTABILITY: If job is completed or cancelled, financial fields cannot be altered
  const isClosedJob = existingJob.status === 'completed' || existingJob.status === 'cancelled';
  const hasFinancialAttempt = req.body.leadPrice !== undefined || 
                               req.body.estimatedValue !== undefined || 
                               req.body.estimatedHours !== undefined || 
                               req.body.specialistAssessedValue !== undefined || 
                               req.body.finalPrice !== undefined || 
                               req.body.calloutFeeAmount !== undefined;

  if (isClosedJob && hasFinancialAttempt) {
    return res.status(409).json({
      error: `Forbidden: Financial data for ${existingJob.status} jobs is immutable through normal APIs.`,
      code: 'CLOSED_JOB_FINANCIAL_IMMUTABLE'
    });
  }

  // RBAC & Ownership / Participation Validation
  if (caller.role === 'customer') {
    const isOwner = (existingJob.customerId && existingJob.customerId === caller.id) ||
                    (existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone) ||
                    (existingJob.customerName && caller.name && existingJob.customerName === caller.name);
    if (!isOwner) {
      return res.status(403).json({ error: 'Forbidden: You do not own this job request.' });
    }
    delete req.body.coordinatorNotes;
    delete req.body.operatorNotes;
    delete req.body.leadPrice;
    delete req.body.coordinatorId;
    delete req.body.operatorId;
  } else if (caller.role === 'specialist') {
    const isUnlockedByMe = existingJob.unlockedBySpecialistId === caller.id;
    const isOfferedToMe = existingJob.offeredSpecialistIds && existingJob.offeredSpecialistIds.includes(caller.id);

    if (!isUnlockedByMe && !isOfferedToMe) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to modify this job.' });
    }
    delete req.body.coordinatorNotes;
    delete req.body.operatorNotes;
    delete req.body.leadPrice;
    delete req.body.coordinatorId;
    delete req.body.operatorId;
  } else if (caller.role === 'operator') {
    if (caller.dashboardNumber && existingJob.hubId && caller.dashboardNumber !== existingJob.hubId) {
      if (existingJob.coordinatorId && existingJob.coordinatorId !== caller.id) {
        return res.status(403).json({ error: 'Forbidden: Job belongs to another territory/operator.' });
      }
    }
  } else if (caller.role === 'regional_admin') {
    if (caller.region && existingJob.region && caller.region !== existingJob.region) {
      return res.status(403).json({ error: 'Forbidden: Job outside assigned region.' });
    }
  }

  const { status, coordinatorId, operatorId, coordinatorNotes, operatorNotes, estimatedHours, estimatedValue, leadPrice, unlockedBySpecialistId, offeredSpecialistIds, subcategory } = req.body;

  if (pool) {
    try {
      const client = await pool.connect();
      
      // Load current job
      const currentRes = await client.query('SELECT * FROM jobs WHERE id = $1', [id]);
      if (currentRes.rows.length > 0) {
        const current = currentRes.rows[0];
        
        const finalStatus = status !== undefined ? status : current.status;
        const finalCoordId = coordinatorId !== undefined ? coordinatorId : (operatorId !== undefined ? operatorId : current.coordinator_id);
        const finalNotes = coordinatorNotes !== undefined ? coordinatorNotes : (operatorNotes !== undefined ? operatorNotes : current.coordinator_notes);
        const finalHours = estimatedHours !== undefined ? estimatedHours : current.estimated_hours;
        const finalVal = estimatedValue !== undefined ? estimatedValue : current.estimated_value;
        const finalLeadPrice = leadPrice !== undefined ? leadPrice : current.lead_price;
        const finalSpecId = unlockedBySpecialistId !== undefined ? unlockedBySpecialistId : current.unlocked_by_specialist_id;

        await client.query(
          `UPDATE jobs 
           SET status = $1, coordinator_id = $2, coordinator_notes = $3, estimated_hours = $4, estimated_value = $5, lead_price = $6, unlocked_by_specialist_id = $7
           WHERE id = $8`,
          [finalStatus, finalCoordId, finalNotes, finalHours, finalVal, finalLeadPrice, finalSpecId, id]
        );
      }

      client.release();
    } catch (err) {
      console.error('Error updating job on Neon:', err);
    }
  }

  // Fallback / in-memory sync
  const job = inMemoryJobs.find(j => j.id === id);
  if (job) {
    if (status !== undefined) job.status = status;
    if (coordinatorId !== undefined) { job.coordinatorId = coordinatorId; job.operatorId = coordinatorId; }
    if (operatorId !== undefined) { job.coordinatorId = operatorId; job.operatorId = operatorId; }
    if (coordinatorNotes !== undefined) { job.coordinatorNotes = coordinatorNotes; job.operatorNotes = coordinatorNotes; }
    if (operatorNotes !== undefined) { job.coordinatorNotes = operatorNotes; job.operatorNotes = operatorNotes; }
    if (estimatedHours !== undefined) job.estimatedHours = estimatedHours;
    if (estimatedValue !== undefined) job.estimatedValue = estimatedValue;
    if (leadPrice !== undefined) job.leadPrice = leadPrice;
    if (offeredSpecialistIds !== undefined) job.offeredSpecialistIds = offeredSpecialistIds;
    if (subcategory !== undefined) job.subcategory = subcategory;
    if (unlockedBySpecialistId !== undefined) job.unlockedBySpecialistId = unlockedBySpecialistId;
  }

  res.json({ success: true, job });
});

// 7. Post Message on Job Feed
app.post('/api/jobs/:id/messages', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const { content, text, channel, attachmentUrl, attachmentName } = req.body;
  const messageBody = (content || text || '').trim();
  const idempotencyKey = extractIdempotencyKey(req);

  if (idempotencyKey) {
    const existingRecord = await getIdempotencyRecord(caller.id, idempotencyKey);
    if (existingRecord) {
      if (existingRecord.operation !== 'post_message' || existingRecord.resourceId !== id) {
        return res.status(400).json({
          error: 'Idempotency key reuse mismatch: key was previously used for a different operation or resource.',
          code: 'IDEMPOTENCY_KEY_REUSE_MISMATCH'
        });
      }
      return res.status(existingRecord.status).json(existingRecord.response);
    }
  }

  const existingJob = await findJobById(id);
  if (!existingJob) {
    return res.status(404).json({ error: 'Job not found' });
  }

  let isAuthorized = false;
  if (caller.role === 'super_admin') {
    isAuthorized = true;
  } else if (caller.role === 'customer') {
    if (
      (existingJob.customerId && existingJob.customerId === caller.id) ||
      (existingJob.customerPhone && caller.phone && existingJob.customerPhone === caller.phone) ||
      (existingJob.customerName && caller.name && existingJob.customerName === caller.name)
    ) {
      isAuthorized = true;
    }
  } else if (caller.role === 'specialist') {
    if (
      existingJob.unlockedBySpecialistId === caller.id ||
      (existingJob.offeredSpecialistIds && existingJob.offeredSpecialistIds.includes(caller.id))
    ) {
      isAuthorized = true;
    }
  } else if (caller.role === 'operator') {
    if (!caller.dashboardNumber || !existingJob.hubId || caller.dashboardNumber === existingJob.hubId || existingJob.coordinatorId === caller.id) {
      isAuthorized = true;
    }
  } else if (caller.role === 'regional_admin') {
    if (!caller.region || !existingJob.region || caller.region === existingJob.region) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(403).json({ error: 'Forbidden: You are not a participant in this job chat.' });
  }

  // Duplicate submission check: If identical message was posted by same sender within last 5 seconds, return it
  const currentMsgs = existingJob.messages || [];
  const lastMsg = currentMsgs[currentMsgs.length - 1];
  if (
    lastMsg &&
    lastMsg.sender === caller.role &&
    (lastMsg.content === messageBody || lastMsg.text === messageBody) &&
    (Date.now() - new Date(lastMsg.timestamp).getTime()) < 5000
  ) {
    if (idempotencyKey) {
      await saveIdempotencyRecord(caller.id, idempotencyKey, 'post_message', id, 200, lastMsg);
    }
    return res.json(lastMsg);
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    sender: caller.role,
    senderRole: caller.role,
    senderName: caller.name || caller.email.split('@')[0],
    senderAvatar: undefined,
    content: messageBody,
    text: messageBody,
    timestamp: new Date().toISOString(),
    channel: channel || 'customer_operator',
    attachmentUrl: attachmentUrl || undefined,
    attachmentName: attachmentName || undefined
  };

  if (pool) {
    try {
      const client = await pool.connect();
      const currentRes = await client.query('SELECT messages FROM jobs WHERE id = $1', [id]);
      if (currentRes.rows.length > 0) {
        const messages = typeof currentRes.rows[0].messages === 'string' 
          ? JSON.parse(currentRes.rows[0].messages) 
          : currentRes.rows[0].messages || [];
        
        messages.push(newMessage);

        await client.query(
          'UPDATE jobs SET messages = $1 WHERE id = $2',
          [JSON.stringify(messages), id]
        );
      }
      client.release();
      if (idempotencyKey) {
        await saveIdempotencyRecord(caller.id, idempotencyKey, 'post_message', id, 200, newMessage);
      }
      return res.json(newMessage);
    } catch (err) {
      console.error('Error adding message on Neon:', err);
    }
  }

  const job = inMemoryJobs.find(j => j.id === id);
  if (job) {
    job.messages.push(newMessage);
  }
  if (idempotencyKey) {
    await saveIdempotencyRecord(caller.id, idempotencyKey, 'post_message', id, 200, newMessage);
  }
  res.json(newMessage);
});

// 8. Specialist Actions: Approve Profile & Add Balance
app.post('/api/specialists/:id/action', verifyAuthToken, async (req, res) => {
  const caller = (req as AuthenticatedRequest).authenticatedUser!;
  const { id } = req.params;
  const { action, amount } = req.body; // action: 'approve' | 'add_balance'

  if (action === 'request_verification') {
    if (caller.role === 'customer') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (caller.role === 'specialist' && id !== caller.id) {
      return res.status(403).json({ error: 'Forbidden: Cannot perform verification request on another specialist.' });
    }
  } else if (action === 'add_balance') {
    if (caller.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: Balance adjustments require Super Admin authorization.', code: 'FORBIDDEN_BALANCE_ADJUSTMENT' });
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid balance amount: Must be a positive number.', code: 'INVALID_AMOUNT' });
    }
  } else if (['approve', 'reject'].includes(action)) {
    if (caller.role === 'customer' || caller.role === 'specialist') {
      return res.status(403).json({ error: 'Forbidden: Administrative action requires operator or admin role.' });
    }
    if (caller.role === 'operator' || caller.role === 'regional_admin') {
      const targetSpec = await findUserById(id);
      if (caller.region && targetSpec && targetSpec.region && caller.region !== targetSpec.region) {
        return res.status(403).json({ error: 'Forbidden: Specialist outside your assigned region.' });
      }
    }
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }

  if (pool) {
    try {
      const client = await pool.connect();
      if (action === 'approve') {
        await client.query(
          `UPDATE app_users SET specialist_status = 'approved' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'approved' WHERE id = $1`,
          [id]
        );
      } else if (action === 'reject') {
        await client.query(
          `UPDATE app_users SET specialist_status = 'rejected' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'rejected' WHERE id = $1`,
          [id]
        );
      } else if (action === 'request_verification') {
        await client.query(
          `UPDATE app_users SET specialist_status = 'pending_review' WHERE id = $1`,
          [id]
        );
        await client.query(
          `UPDATE specialists SET status = 'pending_review' WHERE id = $1`,
          [id]
        );
      } else if (action === 'add_balance') {
        await client.query(
          `UPDATE specialists SET balance = balance + $1 WHERE id = $2`,
          [parseFloat(amount), id]
        );
      }
      client.release();
      return res.json({ success: true });
    } catch (err) {
      console.error('Error performing specialist action on Neon:', err);
    }
  }

  // Fallback in-memory
  const u = inMemoryUsers.find(user => user.id === id);
  const spec = inMemorySpecialists.find(s => s.id === id);

  if (action === 'approve') {
    if (u) u.specialistStatus = 'approved';
    if (spec) spec.status = 'approved';
  } else if (action === 'reject') {
    if (u) u.specialistStatus = 'rejected';
    if (spec) spec.status = 'rejected';
  } else if (action === 'request_verification') {
    if (u) u.specialistStatus = 'pending_review';
    if (spec) spec.status = 'pending_review';
  } else if (action === 'add_balance') {
    if (spec) {
      spec.balance += parseFloat(amount);
    }
  }

  res.json({ success: true });
});

// 9. Reset database completely (wipe all test/demo data)
app.post('/api/reset-db', verifyAuthToken, requireSuperAdmin, async (req, res) => {
  if (pool) {
    try {
      const client = await pool.connect();
      await client.query('DROP TABLE IF EXISTS jobs');
      await client.query('DROP TABLE IF EXISTS specialists');
      await client.query('DROP TABLE IF EXISTS partner_applications');
      await client.query('DROP TABLE IF EXISTS app_users');
      client.release();
      console.log('All database tables dropped for complete data wipe.');
    } catch (err) {
      console.error('Error dropping tables:', err);
    }
  }

  // Clear in-memory state
  inMemoryJobs = [];
  inMemorySpecialists = [];
  inMemoryPartnerApplications = [];
  inMemoryUsers = [
    {
      id: 'user-super_admin',
      email: 'super_admin@nordbase.pt',
      phone: '+351 900 000 000',
      name: 'Super Admin',
      role: 'super_admin',
      specialistStatus: 'not_requested',
    }
  ];

  await initDb();
  res.json({ success: true, message: 'All database tables and test data have been wiped clean.' });
});

// Unified file upload endpoint that accepts base64 JSON, uploads to Vercel Blob (private store), or falls back to local disk/base64 URL.
app.post('/api/upload', verifyAuthToken, async (req, res) => {
  try {
    const { filename, contentType, base64 } = req.body || {};
    
    if (!base64) {
      return res.status(400).json({ error: 'No file base64 data provided in request body.' });
    }
    
    const buffer = Buffer.from(base64, 'base64');
    const finalFilename = filename || 'uploaded_document';
    const finalMime = contentType || 'application/octet-stream';
    const fallbackDataUrl = `data:${finalMime};base64,${base64}`;
    
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.STORAGE_READ_WRITE_TOKEN;
    
    if (blobToken) {
      // Vercel Blob Server-Side Upload for Private Stores
      const safeFilename = `${Date.now()}-${finalFilename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      try {
        const blob = await put(safeFilename, buffer, {
          access: 'private',
          token: blobToken,
          addRandomSuffix: true,
        });
        
        console.log('Successfully uploaded file to Vercel Blob (PRIVATE):', blob.url);
        // Proxy URL to serve private file with token authorization
        return res.json({ url: `/api/image?url=${encodeURIComponent(blob.url)}` });
      } catch (privateErr: any) {
        console.error('Vercel Blob private upload error:', privateErr.message || privateErr);
        // Fallback check for public stores if configured differently
        try {
          const blob = await put(safeFilename, buffer, {
            access: 'public',
            token: blobToken,
            addRandomSuffix: true,
          });
          console.log('Successfully uploaded file to Vercel Blob (PUBLIC fallback):', blob.url);
          return res.json({ url: blob.url });
        } catch (pubErr: any) {
          console.error('Vercel Blob public fallback failed as well:', pubErr.message || pubErr);
        }
      }
    }
    
    // Fallback: Try local file write or base64 Data URL
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const safeFilename = `${Date.now()}-${finalFilename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filePath = path.join(uploadsDir, safeFilename);
      fs.writeFileSync(filePath, buffer);
      const localUrl = `/uploads/${safeFilename}`;
      console.log('Uploaded file: Generated local static file URL:', localUrl);
      return res.json({ url: localUrl });
    } catch (localWriteErr: any) {
      console.warn('Local disk write failed (read-only environment). Returning base64 Data URL.');
      return res.json({ url: fallbackDataUrl });
    }
    
  } catch (err: any) {
    console.error('Error handling upload:', err);
    if (req.body && req.body.base64) {
      const mime = req.body.contentType || 'application/octet-stream';
      return res.json({ url: `data:${mime};base64,${req.body.base64}` });
    }
    res.status(500).json({ error: err.message || 'Failed to process file upload.' });
  }
});

// Proxy endpoint to serve images from private Vercel Blob store
app.get('/api/image', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).send('Missing url parameter');
    }
    
    if (url.includes('.blob.vercel-storage.com')) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.STORAGE_READ_WRITE_TOKEN;
      const response = await fetch(url, {
        headers: {
          ...(blobToken ? { Authorization: `Bearer ${blobToken}` } : {})
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
      }
      
      res.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
    
    return res.redirect(url);
  } catch (err) {
    console.error('Image proxy error:', err);
    res.status(500).send('Failed to proxy image');
  }
});

// Express error-handling middleware for Multer, JSON body parsing, and other server errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Express Error Handler caught an error:', err);
  res.status(err.status || err.statusCode || 500).json({
    error: err.message || 'An unexpected server error occurred.'
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Integration with Vite development server / production static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
