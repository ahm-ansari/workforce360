// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// attach token if using JWT
export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

// lib/api.js
// This file contains placeholder functions that simulate database operations.

let receipts = [
  { id: 'REC001', date: '2025-11-01', client: 'Client A', amount: '$5,000' },
  { id: 'REC002', date: '2025-10-25', client: 'Client B', amount: '$1,200' },
  { id: 'REC003', date: '2025-10-15', client: 'Client C', amount: '$3,500' },
];

let vouchers = [
  { id: 'VOU001', date: '2025-11-02', type: 'Payment', description: 'Salary payout', amount: '$10,000' },
  { id: 'VOU002', date: '2025-10-28', type: 'Expense', description: 'Office supplies', amount: '$500' },
  { id: 'VOU003', date: '2025-10-20', type: 'Payment', description: 'Client refund', amount: '$200' },
];

let ledgers = [
  { id: 'LED001', entryDate: '2025-11-01', account: 'Cash', description: 'Receipt from Client A', debit: '$5,000', credit: '$0' },
  { id: 'LED002', entryDate: '2025-11-02', account: 'Expenses', description: 'Voucher for salary', debit: '$10,000', credit: '$0' },
];

// ----- Receipts functions -----
export async function getReceipts(params: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredReceipts = [...receipts];
  if (params.searchTerm) {
    filteredReceipts = filteredReceipts.filter(receipt =>
      receipt.client.toLowerCase().includes(params.searchTerm.toLowerCase())
    );
  }
  return filteredReceipts;
}

export async function createReceipt(newReceipt: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const newId = `REC${(receipts.length + 1).toString().padStart(3, '0')}`;
  const receiptWithId = { ...newReceipt, id: newId };
  receipts.push(receiptWithId);
  return receiptWithId;
}

// ----- Vouchers functions -----
export async function getVouchers(params: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredVouchers = [...vouchers];
  if (params.searchTerm) {
    filteredVouchers = filteredVouchers.filter(voucher =>
      voucher.description.toLowerCase().includes(params.searchTerm.toLowerCase())
    );
  }
  return filteredVouchers;
}

export async function createVoucher(newVoucher: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newId = `VOU${(vouchers.length + 1).toString().padStart(3, '0')}`;
  const voucherWithId = { ...newVoucher, id: newId };
  vouchers.push(voucherWithId);
  return voucherWithId;
}

// ----- Ledgers functions -----
export async function getLedgers(params: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredLedgers = [...ledgers];
  if (params.searchTerm) {
    filteredLedgers = filteredLedgers.filter(ledger =>
      ledger.description.toLowerCase().includes(params.searchTerm.toLowerCase()) ||
      ledger.account.toLowerCase().includes(params.searchTerm.toLowerCase())
    );
  }
  return filteredLedgers;
}

export { receipts, vouchers, ledgers, api };

// export default api;