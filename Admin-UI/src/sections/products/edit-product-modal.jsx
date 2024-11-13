import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import productsApi from 'src/api/products';

import Iconify from 'src/components/iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  width: 800,
  maxHeight: 500,
  p: 4,
  overflow: 'auto',
};

export default function EditProductModal({ handleClose, open, product, id, getProducts }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    desc: product.desc,
  });

  const handleChange = (event, key) => {
    if (key === 'price') {
      if (/^\d+$/.test(event.target.value)) {
        setForm((prev) => ({
          ...prev,
          price: event.target.value,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    }
  };

  const createProducts = useCallback(async () => {
    if (form.name === '' || form.price === '') {
      return;
    }
    const res = await productsApi.update(
      {
        name: form.name,
        price: form.price,
        desc: form.desc, 
      },
      id
    );
    if (res.status && res.status === 200) {
      //  updateProducts();
      getProducts();
      handleClose();
    }
  }, [form, id, handleClose, getProducts]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid
          container
          spacing={3}
          sx={{ width: '100%', marginLeft: 0, alignItems: 'center', rowGap: '10px' }}
        >
          <Grid xs={12} sm={3} md={3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Name:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <TextField
              name="name"
              label="Product Name"
              value={form.name}
              onChange={(event) => handleChange(event, 'name')}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid xs={12} sm={3} md={3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Price:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <TextField
              name="name"
              label="Product Price"
              value={form.price}
              onChange={(event) => handleChange(event, 'price')}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid xs={12} sm={3} md={3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Description:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <TextField
              name="desc"
              label="Description"
              value={form.desc}
              onChange={(event) => handleChange(event, 'desc')}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid xs={12} sm={3} md={3} />
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={createProducts}
            >
              Update Product
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

EditProductModal.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object,
  getProducts: PropTypes.func,
  id: PropTypes.string,
};
