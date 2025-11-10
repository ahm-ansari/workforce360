import { getReceipts, createReceipt } from '@/lib/api';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const receipts = await getReceipts(req.query);
    return res.status(200).json(receipts);
  }

  if (req.method === 'POST') {
    const newReceipt = await createReceipt(req.body);
    return res.status(201).json(newReceipt);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}


