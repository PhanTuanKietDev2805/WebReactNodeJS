import { useState } from 'react';
import PropTypes from 'prop-types';
import { MuiFileInput } from 'mui-file-input';

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

const initialState = {
  name: '',
  price: '',
  unit: 1,
  available: true,
  suplier: '',
  desc: '',
  type: 'HandBags',
};

export default function AddProductModal({ handleClose, open, updateProducts }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    unit: 1,
    available: true,
    suplier: '',
    desc: '',
    type: 'HandBags',
  });

  const [banner, setBanner] = useState(null);

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

  const handleFileChange = (newFile) => {
    setBanner(newFile);
  };

  const createProducts = async () => {
    if (form.name === '' || form.price === '' || banner === null) {
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('unit', form.unit);
    formData.append('available', form.available);
    formData.append('suplier', form.suplier);
    formData.append('desc', form.desc);
    formData.append('type', form.type);
    formData.append('banner', banner);
    const res = await productsApi.create(formData);
    if (res.status && res.status === 200) {
      updateProducts();
      setForm(initialState);
      setBanner(null);
      handleClose();
    }
  };

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
              Image:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <MuiFileInput
              value={banner}
              onChange={handleFileChange}
              inputProps={{ accept: '.png, .jpeg' }}
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
              New Product
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

AddProductModal.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  updateProducts: PropTypes.func,
};
