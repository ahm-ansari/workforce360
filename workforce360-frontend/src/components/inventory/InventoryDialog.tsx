// /components/inventory/InventoryDialog.tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';


export default function InventoryDialog({ open, onClose, onSave, item }) {
    const [form, setForm] = React.useState(item || { name: '', category: '', quantity: 0, unitPrice: 0 });


    React.useEffect(() => {
        setForm(item || { name: '', category: '', quantity: 0, unitPrice: 0 });
    }, [item]);


    const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));


    const save = () => {
        if (!form.name) return alert('Name required');
        // coerce numbers
        const payload = { ...form, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice) };
        if (item && item.id) payload.id = item.id;
        onSave(payload);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Category" value={form.category} onChange={handleChange('category')} fullWidth />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Quantity" type="number" value={form.quantity} onChange={handleChange('quantity')} fullWidth />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField label="Unit Price" type="number" value={form.unitPrice} onChange={handleChange('unitPrice')} fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={save}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}