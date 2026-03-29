const { getSupabase, hashPassword, createSession, setCookie, json, SESSION_TTL_MS } = require('./_lib');

module.exports = async (req, res) => {
  const sb = getSupabase();

  // GET /api/setup-status
  if (req.method === 'GET') {
    const { count } = await sb.from('users').select('*', { count: 'exact', head: true });
    return json(res, 200, { needsSetup: count === 0 });
  }

  // POST /api/setup — create first admin
  if (req.method === 'POST') {
    const { count } = await sb.from('users').select('*', { count: 'exact', head: true });
    if (count > 0) return json(res, 403, { error: 'Setup already done' });

    const { username, password } = req.body;
    if (!username || !password) return json(res, 400, { error: 'Missing fields' });
    if (password.length < 6)    return json(res, 400, { error: 'Password too short (min 6 chars)' });

    const hashed = hashPassword(password);
    const { data, error } = await sb
      .from('users')
      .insert({ username, password: hashed, role: 'admin' })
      .select('id, username, role')
      .single();

    if (error) return json(res, 500, { error: 'Could not create user' });

    const token = await createSession(data.id);
    setCookie(res, 'kasbon_session', token, SESSION_TTL_MS / 1000);
    return json(res, 201, { ok: true, username: data.username, role: data.role });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
