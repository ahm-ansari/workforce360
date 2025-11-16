// /components/inventory/InventoryKPIs.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { inventoryItems } from '@/utils/inventoryData'; 


function calculateKPIs(items: any[]) {
    const totalProducts = items.length;
    const inStock = items.filter((i) => i.quantity > 0).length;
    const outOfStock = items.filter((i) => i.quantity === 0).length;
    const totalValue = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    return { totalProducts, inStock, outOfStock, totalValue };
}


export default function InventoryKPIs() {
    const k = calculateKPIs(inventoryItems);


    const KPIS = [
        { title: 'Total Products', value: k.totalProducts },
        { title: 'In Stock', value: k.inStock },
        { title: 'Out of Stock', value: k.outOfStock },
        { title: 'Total Value', value: `$${k.totalValue.toFixed(2)}` },
    ];


    return (
        <Grid container spacing={2}>
            {KPIS.map((p) => (
                <Grid size={{xs: 12, sm: 6, md: 3}} key={p.title}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>{p.title}</Typography>
                            <Typography variant="h5">{p.value}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}