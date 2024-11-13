import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import OrderModalTable from '../order/order-modal-table';

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

export default function UserDetailModal({ user, handleClose, open }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container spacing={3} sx={{ width: '100%', marginLeft: 0, alignItems: 'end' }}>
          <Grid xs={12} sm={3} md={3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Email:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <Typography id="modal-modal-title" variant="body1" component="h2">
              {user?.email}
            </Typography>
          </Grid>
          <Grid xs={12} sm={3} md={3}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Phone:
            </Typography>
          </Grid>
          <Grid xs={12} sm={9} md={9} sx={{ textAlign: 'end' }}>
            <Typography id="modal-modal-title" variant="body1" component="h2">
              {user?.phone}
            </Typography>
          </Grid>
        </Grid>

        <OrderModalTable orders={user?.orders} />
      </Box>
    </Modal>
  );
}

UserDetailModal.propTypes = {
  user: PropTypes.any,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
};
