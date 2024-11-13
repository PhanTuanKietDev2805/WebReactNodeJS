import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Button, Select, MenuItem, FormControl } from '@mui/material';

import orderApi from 'src/api/order';

import ShopProductCard from '../products/product-card';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  width: 800,
  maxHeight: 600,
  p: 4,
  overflow: 'auto',
};

export default function OrderDetailModal({ orderId, handleClose, open }) {
  const initialState = {
    status: '',
  };
  const [formValue, setFormValue] = useState(initialState);
  const [detail, setDetail] = useState({});

  const getDetail = useCallback(async () => {
    const res = await orderApi.getOrderById(orderId);
    if (res.status && res.status === 200) {
      setDetail(res.data);

      setFormValue({
        status: res.data?.status,
      });
    }
  }, [orderId]);

  useEffect(() => {
    getDetail();
  }, [orderId, getDetail]);

  const handleChange = (key, event) => {
    setFormValue((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const statuses = [
    { id: 'New Order', name: 'New Order' },
    { id: 'Paid', name: 'Paid' },
    { id: 'Delivering', name: 'Delivering' },
    { id: 'Cancel', name: 'Cancel' },
    { id: 'Success', name: 'Success' },
  ];

  const updateOrderDetail = async () => {
    await orderApi.updateOrder(orderId, formValue.status);
    window.location.reload();
    handleClose();
  };

  return (
    detail && (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3} sx={{ width: '100%', marginLeft: 0, alignItems: 'end' }}>
            <Grid xs={12} sm={4} md={4}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Email:
              </Typography>
            </Grid>
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <Typography id="modal-modal-title" variant="body1" component="h2">
                {detail?.customer?.email}
              </Typography>
            </Grid>
            <Grid xs={12} sm={4} md={4}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Receiver name:
              </Typography>
            </Grid>
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <Typography id="modal-modal-title" variant="body1" component="h2">
                {detail?.name}
              </Typography>
            </Grid>
            <Grid xs={12} sm={4} md={4}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Receiver address:
              </Typography>
            </Grid>
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <Typography id="modal-modal-title" variant="body1" component="h2">
                {detail?.address}
              </Typography>
            </Grid>
            <Grid xs={12} sm={4} md={4}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Receiver phone:
              </Typography>
            </Grid>
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <Typography id="modal-modal-title" variant="body1" component="h2">
                {detail?.phone}
              </Typography>
            </Grid>
            <Grid xs={12} sm={4} md={4}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Status:
              </Typography>
            </Grid>
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <FormControl fullWidth sx={{ width: '200px' }}>
                <Select
                  label="status"
                  htmlFor={formValue.status}
                  value={formValue.status && formValue.status}
                  onChange={(event) => handleChange('status', event)}
                >
                  {statuses.map((data) => (
                    <MenuItem value={data.id}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={4} md={4} />
            <Grid xs={12} sm={8} md={8} sx={{ textAlign: 'end' }}>
              <Button
                size="large"
                type="submit"
                variant="contained"
                sx={{ width: '30%' }}
                onClick={() => updateOrderDetail(orderId, formValue.status)}
              >
                Submit
              </Button>
            </Grid>

            <Grid xs={12} sm={12} md={12}>
              <Typography
                id="modal-modal-description"
                variant="h6"
                component="h2"
                sx={{ textAlign: 'start', marginBottom: '16px' }}
              >
                Items
              </Typography>
              <Grid container spacing={3} sx={{ width: '100%' }}>
                {detail?.items?.map((item) => (
                  <Grid key={item.product._id} xs={12} sm={6} md={6}>
                    <ShopProductCard
                      product={item.product}
                      getProducts={() => {}}
                      quantity={item.quantity}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    )
  );
}

OrderDetailModal.propTypes = {
  orderId: PropTypes.any,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
};
