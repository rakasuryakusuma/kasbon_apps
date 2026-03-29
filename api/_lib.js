const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// ── Password helpers ──
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const attempt = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  try { return crypto.timingSafeEqual(Buffer.from(hash,'hex'), Buffer.from(attempt,'hex')); }
  catch { return false; }
}

// ── Session helpers ──
function parseCookies(req) {
  const cookies = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const [k, ...v] = p.trim().split('=');
    if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
  });
  return cookies;
}

async function getSession(req) {
  const token = parseCookies(req).kasbon_session;
  if (!token) return null;
  const sb = getSupabase();
  const { data } = await sb
    .from('sessions')
    .select('token, user_id, users(username, role)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();
  if (!data) return null;
  return {
    token,
    user_id: data.user_id,
    username: data.users.username,
    role: data.users.role
  };
}

async function createSession(userId) {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  const sb = getSupabase();
  await sb.from('sessions').insert({ token, user_id: userId, expires_at: expiresAt });
  return token;
}

async function destroySession(token) {
  const sb = getSupabase();
  await sb.from('sessions').delete().eq('token', token);
}

function setCookie(res, name, value, maxAge) {
  res.setHeader('Set-Cookie', `${name}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`);
}
function clearCookie(res, name) {
  res.setHeader('Set-Cookie', `${name}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
}

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

module.exports = {
  getSupabase, hashPassword, verifyPassword,
  parseCookies, getSession, createSession, destroySession,
  setCookie, clearCookie, json,
  SESSION_TTL_MS
};
