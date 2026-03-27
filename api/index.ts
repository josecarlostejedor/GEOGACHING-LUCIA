import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  if (method === 'GET') {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    if (url.pathname === '/api/ping') {
      return res.status(200).json({ status: 'pong', timestamp: new Date().toISOString() });
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Búsqueda de Tesoros API is alive',
      timestamp: new Date().toISOString(),
      env_configured: !!process.env.VITE_GOOGLE_SHEETS_URL
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
