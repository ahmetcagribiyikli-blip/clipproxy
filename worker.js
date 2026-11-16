export default {
  async fetch(req) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    let t;
    try { t = new URL(new URL(req.url).searchParams.get('url')); }
    catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
    const allowed = ['pixabay.com', 'pexels.com'];
    const ok = t.protocol === 'https:' &&
      allowed.some(h => t.hostname === h || t.hostname.endsWith('.' + h));
    if (!ok) return new Response('blocked', { status: 403, headers: cors });
    const r = await fetch(t.toString());
    const h = new Headers(r.headers);
    Object.entries(cors).forEach(([k, v]) => h.set(k, v));
    return new Response(r.body, { status: r.status, headers: h });
  }
}
