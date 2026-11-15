// Returns the visitor's country as seen by Vercel, so the page can pick a
// default language. Never cached: the answer depends on who is asking.
export const config = { runtime: 'edge' };

export default function handler(request) {
  const country = request.headers.get('x-vercel-ip-country') || '';
  return new Response(JSON.stringify({ country }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' },
  });
}
