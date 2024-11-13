import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { MuiFileInput } from 'mui-file-input';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
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

export default function EditImageModal({ handleClose, open, id, getProducts }) {
  const [banner, setBanner] = useState(null);

  const handleFileChange = (newFile) => {
    setBanner(newFile);
  };

  const createProducts = useCallback(async () => {
    if (banner === null) {
      return;
    }
    const formData = new FormData();
    formData.append('banner', banner);
    const res = await productsApi.updateImage(formData, id);
    if (res.status && res.status === 200) {
      getProducts();
      handleClose();
    }
  }, [banner, id, handleClose, getProducts]);

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

EditImageModal.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  getProducts: PropTypes.func,
  id: PropTypes.string,
};
