// /components/billing/InvoiceDialog.tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


export default function InvoiceDialog({ open, onClose, onCreate }) {
    const [form, setForm] = React.useState({ customer: '', date: '', dueDate: '', amount: '', status: 'Draft', items: [] });


    const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));


    const submit = () => {
        if (!form.customer || !form.amount) return alert('Customer and amount required');
        onCreate(form);
        onClose();
        setForm({ customer: '', date: '', dueDate: '', amount: '', status: 'Draft', items: [] });
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Customer" value={form.customer} onChange={handleChange('customer')} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField label="Date" type="date" value={form.date} onChange={handleChange('date')} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField label="Due Date" type="date" value={form.dueDate} onChange={handleChange('dueDate')} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField label="Amount" value={form.amount} onChange={handleChange('amount')} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField label="Status" value={form.status} onChange={handleChange('status')} fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={submit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}