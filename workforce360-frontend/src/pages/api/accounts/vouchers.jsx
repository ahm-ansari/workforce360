import { getVouchers, createVoucher } from '@/lib/api';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const vouchers = await getVouchers(req.query);
    return res.status(200).json(vouchers);
  }

  if (req.method === 'POST') {
    const newVoucher = await createVoucher(req.body);
    return res.status(201).json(newVoucher);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
