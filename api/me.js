const { getSession, json } = require('./_lib');

module.exports = async (req, res) => {
  // 1. Try to get the session from the cookie
  const session = await getSession(req);

  // 2. If no cookie or session expired, tell the frontend
  if (!session) {
    return json(res, 200, { authenticated: false });
  }

  // 3. If valid, return the user info so the UI can show the dashboard
  return json(res, 200, { 
    authenticated: true, 
    username: session.username, 
    role: session.role 
  });
};
