const { getSupabase, getSession, json } = require('./_lib');

module.exports = async (req, res) => {
  const session = await getSession(req);
  if (!session) return json(res, 401, { error: 'Unauthorized' });

  const sb  = getSupabase();
  const url = req.url.replace(/\?.*$/, '');

  // Extract transaction id from URL if present: /api/transactions/123
  const idMatch = url.match(/\/transactions\/(\d+)$/);
  const txId    = idMatch ? parseInt(idMatch[1]) : null;

  // GET /api/transactions
  if (!txId && req.method === 'GET') {
    const { data, error } = await sb
      .from('transactions')
      // Alias the 'description' column to 'desc' so the frontend is happy
      .select('id, type, desc:description, amount, category, date')
      .eq('user_id', session.user_id)
      .order('created_at', { ascending: false });
      
    // Bonus: Output the actual error message so you can see it in Vercel logs!
    if (error) return json(res, 500, { error: error.message }); 
    return json(res, 200, data);
  }

  // POST /api/transactions
  if (!txId && req.method === 'POST') {
    const { type, desc, amount, category, date } = req.body;
    if (!type || !desc || !amount || !category || !date)
      return json(res, 400, { error: 'Missing fields' });

    const { data, error } = await sb
      .from('transactions')
      // Insert 'desc' into the 'description' column
      .insert({ user_id: session.user_id, type, description: desc, amount, category, date })
      // Return the newly created row with the alias
      .select('id, type, desc:description, amount, category, date')
      .single();
      
    if (error) return json(res, 500, { error: error.message });
    return json(res, 201, data);
  }

  // DELETE /api/transactions/:id
  if (txId && req.method === 'DELETE') {
    const { error } = await sb
      .from('transactions')
      .delete()
      .eq('id', txId)
      .eq('user_id', session.user_id); // safety: only delete own transactions
      
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
