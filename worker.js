const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export default {
  async fetch(req) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const u = new URL(req.url).searchParams.get('url');
    if (!u) return new Response('proxy ok', { status: 200, headers: cors });
    let t;
    try { t = new URL(u); }
    catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
    const allowed = ['pixabay.com', 'pexels.com'];
    const ok = t.protocol === 'https:' &&
      allowed.some(h => t.hostname === h || t.hostname.endsWith('.' + h));
    if (!ok) return new Response('blocked', { status: 403, headers: cors });
    const origin = t.hostname.endsWith('pexels.com') ? 'https://www.pexels.com' : 'https://pixabay.com';
    const r = await fetch(t.toString(), {
      headers: { 'User-Agent': UA, 'Referer': origin + '/', 'Origin': origin, 'Accept': '*/*' },
      redirect: 'follow'
    });
    const h = new Headers(r.headers);
    Object.entries(cors).forEach(([k, v]) => h.set(k, v));
    return new Response(r.body, { status: r.status, headers: h });
  }
}
