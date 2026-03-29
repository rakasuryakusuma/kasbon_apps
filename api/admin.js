const { getSupabase, getSession, hashPassword, json } = require('./_lib');

module.exports = async (req, res) => {
  const session = await getSession(req);
  if (!session)              return json(res, 401, { error: 'Unauthorized' });
  if (session.role !== 'admin') return json(res, 403, { error: 'Forbidden' });

  const sb  = getSupabase();
  const url = req.url.replace(/\?.*$/, '');
  const idMatch = url.match(/\/admin\/users\/(\d+)$/);
  const userId  = idMatch ? parseInt(idMatch[1]) : null;

  // GET /api/admin/users
  if (!userId && req.method === 'GET') {
    const { data } = await sb
      .from('users')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: true });
    return json(res, 200, data || []);
  }

  // POST /api/admin/users
  if (!userId && req.method === 'POST') {
    const { username, password, role } = req.body;
    if (!username || !password) return json(res, 400, { error: 'Missing fields' });
    if (password.length < 6)    return json(res, 400, { error: 'Password too short' });

    const { data: existing } = await sb.from('users').select('id').eq('username', username).single();
    if (existing) return json(res, 409, { error: 'Username already taken' });

    const { data, error } = await sb
      .from('users')
      .insert({ username, password: hashPassword(password), role: role === 'admin' ? 'admin' : 'user' })
      .select('id, username, role')
      .single();
    if (error) return json(res, 500, { error: 'Could not create user' });
    return json(res, 201, data);
  }

  // DELETE /api/admin/users/:id
  if (userId && req.method === 'DELETE') {
    if (userId === session.user_id) return json(res, 400, { error: 'Cannot delete yourself' });
    await sb.from('users').delete().eq('id', userId);
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
