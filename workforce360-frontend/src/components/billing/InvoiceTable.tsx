// /components/billing/InvoiceTable.tsx
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
import InvoiceDialog from './InvoiceDialog';
import { sampleInvoices } from '../../utils/invoiceData';
import InvoiceView from './InvoiceView';


export default function InvoiceTable() {
    const [open, setOpen] = React.useState(false);
    const [viewInvoice, setViewInvoice] = React.useState(null);
    const [rows, setRows] = React.useState(sampleInvoices);


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'customer', headerName: 'Customer', width: 220 },
        { field: 'date', headerName: 'Date', width: 130 },
        { field: 'dueDate', headerName: 'Due Date', width: 130 },
        { field: 'amount', headerName: 'Amount', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'actions', headerName: 'Actions', width: 180, renderCell: (params) => (
                <Box>
                    <Button size="small" onClick={() => setViewInvoice(params.row)}>View</Button>
                    <Button size="small" sx={{ ml: 1 }} onClick={() => downloadInvoicePDF(params.row)}>PDF</Button>
                </Box>
            )
        },
    ];


    const createInvoice = (invoice) => {
        setRows((r) => [{ ...invoice, id: r.length + 1 }, ...r]);
    };


    const downloadInvoicePDF = (invoice) => {
        // open InvoiceView in new tab with printable content
        // For now use window.print via a popup window rendering invoice HTML
        const w = window.open('', '_blank');
        const html = document.getElementById(`invoice-${invoice.id}`)?.outerHTML;
        w.document.write('<html><head><title>Invoice</title></head><body>');
        w.document.write(html || `<pre>${JSON.stringify(invoice, null, 2)}</pre>`);
        w.document.write('</body></html>');
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 500);
    };


    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Invoices</Typography>
                    <Box>
                        <IconButton color="primary" onClick={() => alert('Export CSV - implement backend or client export')}>
                            <GetAppIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => window.print()}>
                            <PrintIcon />
                        </IconButton>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ ml: 1 }}>
                            Create Invoice
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
                <InvoiceDialog open={open} onClose={() => setOpen(false)} onCreate={createInvoice} />


                {/* Hidden Invoice views for printable HTML */}
                <div style={{ display: 'none' }}>
                    {rows.map((inv) => (
                        <div id={`invoice-${inv.id}`} key={`inv-${inv.id}`}>
                            <InvoiceView invoice={inv} />
                        </div>
                    ))}
                </div>


            </CardContent>
        </Card>
    );


}