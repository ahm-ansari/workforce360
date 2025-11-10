import { getLedgers } from '@/lib/api';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const ledgers = await getLedgers(req.query);
    return res.status(200).json(ledgers);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
