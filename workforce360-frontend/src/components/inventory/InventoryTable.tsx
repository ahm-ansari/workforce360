// /components/inventory/InventoryTable.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import InventoryDialog from '@/components/inventory/InventoryDialog';
import { inventoryItems as initialItems } from '@/utils/inventoryData';
import Chip from '@mui/material/Chip';


function stockBadge(quantity: number) {
    if (quantity === 0) return <Chip label="Out of Stock" color="error" size="small" />;
    if (quantity < 5) return <Chip label="Low Stock" color="warning" size="small" />;
    return <Chip label="In Stock" color="success" size="small" />;
}


export default function InventoryTable() {
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = React.useState(initialItems);


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'sku', headerName: 'SKU', width: 140 },
        { field: 'name', headerName: 'Name', width: 240 },
        { field: 'category', headerName: 'Category', width: 160 },
        { field: 'quantity', headerName: 'Quantity', width: 120 },
        { field: 'unitPrice', headerName: 'Unit Price', width: 120 },
        { field: 'status', headerName: 'Status', width: 140, renderCell: (params) => stockBadge(params.row.quantity) },
        {
            field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => (
                <Box>
                    <Button size="small" onClick={() => editItem(params.row)}>Edit</Button>
                    <Button size="small" sx={{ ml: 1 }} color="error" onClick={() => deleteItem(params.row.id)}>Delete</Button>
                </Box>
            )
        },
    ];


    const editItem = (row: any) => {
        setSelected(row);
        setOpen(true);
    };


    const deleteItem = (id: number) => {
        if (!confirm('Delete this item?')) return;
        setRows((r) => r.filter((x) => x.id !== id));
    };


    const [selected, setSelected] = React.useState(null);


    const onCreateOrUpdate = (item: any) => {
        if (item.id) {
            setRows((r) => r.map((x) => (x.id === item.id ? item : x)));
        } else {
            const newItem = { ...item, id: rows.length + 1, sku: `SKU-${rows.length + 1}` };
            setRows((r) => [newItem, ...r]);
        }
        setSelected(null);
    };


    const exportCSV = () => {
        const header = ['id', 'sku', 'name', 'category', 'quantity', 'unitPrice'];
        const csv = [header.join(',')].concat(rows.map(r => [r.id, r.sku, r.name, r.category, r.quantity, r.unitPrice].join(','))).join('');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory.csv';
        a.click();
        URL.revokeObjectURL(url);
    };


    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Inventory</Typography>
                    <Box>
                        <IconButton color="primary" onClick={exportCSV} title="Export CSV">
                            <GetAppIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => window.print()} title="Print">
                            <PrintIcon />
                        </IconButton>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setSelected(null); setOpen(true); }} sx={{ ml: 1 }}>
                            Add Item
                        </Button>
                    </Box>
                </Box>


                <div style={{ height: 520, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5, 10, 20]}
                        components={{ Toolbar: GridToolbar }}
                    />
                </div>


                <InventoryDialog open={open} onClose={() => setOpen(false)} onSave={onCreateOrUpdate} item={selected} />
            </CardContent>
        </Card>
    );
}