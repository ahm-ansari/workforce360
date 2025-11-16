// /utils/mockSettingsData.ts
export const settingsMock = {
system: { appName: 'Admin Dashboard', timezone: 'GMT+5:30', language: 'English', dateFormat: 'DD/MM/YYYY', maintenanceMode: false },
users: { defaultRoles: true, passwordPolicy: true, accessControl: true },
notifications: { email: true, inApp: true, sms: false },
logs: Array.from({ length: 20 }).map((_, i) => ({ id: i+1, setting: ['System','Users','Notifications'][i%3], changedBy: ['Admin','Superuser'][i%2], date: new Date(Date.now() - i*3600*1000).toISOString().slice(0,19).replace('T',' ')}))
};