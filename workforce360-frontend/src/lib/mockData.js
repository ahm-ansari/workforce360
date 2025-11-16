// lib/mockData.js

export const payrollDashboardData = {
  totalMonthlyPayroll: 25000,
  upcomingPayDate: '2025-11-25',
  newHiresThisMonth: 5,
  pendingApprovals: 2,
};

export const payRuns = [
  {
    id: 1,
    period: 'Nov 1 - Nov 15, 2025',
    status: 'Processed',
    processedOn: '2025-11-15',
    totalAmount: 15000,
  },
  {
    id: 2,
    period: 'Oct 16 - Oct 31, 2025',
    status: 'Processed',
    processedOn: '2025-10-31',
    totalAmount: 12500,
  },
  {
    id: 3,
    period: 'Oct 1 - Oct 15, 2025',
    status: 'Processed',
    processedOn: '2025-10-15',
    totalAmount: 12000,
  },
  {
    id: 4,
    period: 'Sep 16 - Sep 30, 2025',
    status: 'Pending Approval',
    processedOn: null,
    totalAmount: 12500,
  },
];

export const employees = [
  {
    id: 101,
    name: 'John Doe',
    department: 'Engineering',
    salary: 6000,
    grossPay: 3000,
    netPay: 2500,
    status: 'Active',
  },
  {
    id: 102,
    name: 'Jane Smith',
    department: 'Marketing',
    salary: 5500,
    grossPay: 2750,
    netPay: 2280,
    status: 'Active',
  },
  {
    id: 103,
    name: 'Peter Jones',
    department: 'Sales',
    salary: 7000,
    grossPay: 3500,
    netPay: 2900,
    status: 'Active',
  },
];

export const employeePayrolls = {
  101: [
    { payrunId: 1, period: 'Nov 1-15', gross: 3000, net: 2500 },
    { payrunId: 2, period: 'Oct 16-31', gross: 3000, net: 2500 },
  ],
  102: [
    { payrunId: 1, period: 'Nov 1-15', gross: 2750, net: 2280 },
    { payrunId: 2, period: 'Oct 16-31', gross: 2750, net: 2280 },
  ],
};