import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import productsApi from 'src/api/products';

import EditImageModal from './edit-image-modal';
import EditProductModal from './edit-product-modal';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product, getProducts, quantity = null }) {
  const [open, setOpen] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenImage = () => setOpenImage(true);

  const handleCloseImage = () => {
    setOpenImage(false);
  };

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.banner}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'contain',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      &nbsp;
      {fCurrency(product.price)}
    </Typography>
  );

  const handleDeleteProduct = async () => {
    const res = await productsApi.delete(product._id);
    if (res.status === 200) {
      getProducts();
    }
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>{renderImg}</Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {quantity ? (
            <span>Quantity : {quantity}</span>
          ) : (
            <>
              <Button variant="contained" color="error" onClick={handleDeleteProduct}>
                Delete
              </Button>
              <Button variant="contained" color="success" onClick={handleOpen}>
                Edit
              </Button>
              <Button variant="contained" color="success" onClick={handleOpenImage}>
                Image
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <EditProductModal
        open={open}
        handleClose={handleClose}
        product={product}
        id={product._id}
        getProducts={getProducts}
      />
      <EditImageModal
        open={openImage}
        handleClose={handleCloseImage}
        id={product._id}
        getProducts={getProducts}
      />
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
  getProducts: PropTypes.func,
  quantity: PropTypes.any,
};
