// /utils/mockReportsData.ts
export const reportsMock = {
    kpis: {
        employees: 328,
        jobs: 12,
        revenue: 124560,
        inventoryValue: 45230,
    },
    revenueTrend: [
        { month: 'Jan', revenue: 9000 },
        { month: 'Feb', revenue: 12000 },
        { month: 'Mar', revenue: 15000 },
        { month: 'Apr', revenue: 14000 },
        { month: 'May', revenue: 16000 },
        { month: 'Jun', revenue: 17000 },
        { month: 'Jul', revenue: 18000 },
        { month: 'Aug', revenue: 19000 },
        { month: 'Sep', revenue: 15000 },
        { month: 'Oct', revenue: 16000 },
        { month: 'Nov', revenue: 17000 },
        { month: 'Dec', revenue: 18000 },
    ],
    jobsByDept: [
        { department: 'Engineering', count: 6 },
        { department: 'Sales', count: 2 },
        { department: 'Design', count: 1 },
        { department: 'HR', count: 1 },
        { department: 'QA', count: 2 },
    ],
    contractTypes: [
        { name: 'Full-time', value: 260 },
        { name: 'Contract', value: 40 },
        { name: 'Intern', value: 28 },
    ],
    heatmapValues: Array.from({ length: 365 }).map((_, i) => {
        const date = new Date(2025, 0, 1);
        date.setDate(date.getDate() + i);
        const month = date.getMonth();
        const value = Math.max(0, Math.round(3 * Math.exp(-Math.abs(month - 6) / 3) + (Math.random() - 0.6)));
        return { date: date.toISOString().slice(0,10), count: value };
    }),
    recentActivities: Array.from({ length: 24 }).map((_, i) => ({
        id: i+1,
        type: ['Invoice','Inventory','User','Job'][i%4],
        description: `Sample activity ${i+1} generated for reports module`,
        user: ['Admin','System','HR Manager'][i%3],
        date: new Date(Date.now() - i*3600*1000*24).toISOString().slice(0,19).replace('T',' '),
    }))
};