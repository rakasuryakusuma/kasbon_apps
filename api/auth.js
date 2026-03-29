const { parseCookies, destroySession, clearCookie, getSession, json } = require('./_lib');

module.exports = async (req, res) => {
  const url = req.url.replace(/\?.*$/, '');

  // GET /api/me
  if (url.endsWith('/me') && req.method === 'GET') {
    const session = await getSession(req);
    if (!session) return json(res, 401, { authenticated: false });
    return json(res, 200, { authenticated: true, username: session.username, role: session.role });
  }

  // POST /api/logout
  if (url.endsWith('/logout') && req.method === 'POST') {
    const token = parseCookies(req).kasbon_session;
    if (token) await destroySession(token);
    clearCookie(res, 'kasbon_session');
    return json(res, 200, { ok: true });
  }

  return json(res, 404, { error: 'Not found' });
};
