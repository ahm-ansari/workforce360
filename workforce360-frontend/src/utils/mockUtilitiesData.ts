// /utils/mockUtilitiesData.ts
export const utilitiesMock = {
kpis: {
activeUsers: 120,
pendingTasks: 8,
storageUsed: 450,
alerts: 3,
},
tools: [
{ name: 'Backup & Restore', actionLabel: 'Run Backup' },
{ name: 'Clear Cache', actionLabel: 'Clear' },
{ name: 'Sync Data', actionLabel: 'Sync Now' },
{ name: 'Import / Export', actionLabel: 'Open' },
{ name: 'Maintenance Mode', actionLabel: 'Toggle' },
],
logs: Array.from({ length: 20 }).map((_, i) => ({
id: i+1,
action: ['Backup','Clear Cache','Sync','Import','Export'][i%5],
user: ['Admin','System'][i%2],
status: ['Success','Failed'][i%2],
date: new Date(Date.now() - i*3600*1000).toISOString().slice(0,19).replace('T',' '),
})),
statusChart: [
{ name: 'Online', value: 75 },
{ name: 'Offline', value: 15 },
{ name: 'Maintenance', value: 7 },
{ name: 'Error', value: 3 },
]
};