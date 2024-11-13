import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import productsApi from 'src/api/products';

import Iconify from 'src/components/iconify';

import ProductCard from '../product-card';
import AddProductModal from '../add-product-modal';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const getProducts = async () => {
    const res = await productsApi.getProducts();
    if (res.status && res.status === 200) {
      setProducts(res.data.products);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
        >
          New Product
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product._id} xs={12} sm={6} md={3}>
            <ProductCard product={product} getProducts={getProducts} />
          </Grid>
        ))}
      </Grid>
      <AddProductModal open={open} handleClose={handleClose} updateProducts={getProducts} />
    </Container>
  );
}
