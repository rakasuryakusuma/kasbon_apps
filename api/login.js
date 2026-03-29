const { getSupabase, verifyPassword, createSession, setCookie, json, SESSION_TTL_MS } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const { username, password } = req.body;
  const sb = getSupabase();

  const { data: user } = await sb
    .from('users')
    .select('id, username, role, password')
    .eq('username', username)
    .single();

  // Timing-safe: always delay to prevent username enumeration
  await new Promise(r => setTimeout(r, 300));

  if (!user || !verifyPassword(password, user.password)) {
    return json(res, 401, { error: 'Invalid credentials' });
  }

  const token = await createSession(user.id);
  setCookie(res, 'kasbon_session', token, SESSION_TTL_MS / 1000);
  return json(res, 200, { ok: true, username: user.username, role: user.role });
};
