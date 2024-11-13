import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import orderApi from 'src/api/order';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import OrderDetailModal from 'src/sections/order/user-detail-modal';

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrder, setOpenOrder] = useState(false);

  const handleOpenOrder = () => setOpenOrder(true);

  const handleCloseOrder = () => {
    setSelectedOrder(null);
    setOpenOrder(false);
  };

  const handleClick = async (event, orderId, notificationId) => {
    setSelectedOrder(orderId);
    handleOpenOrder();
    const res = await orderApi.readNotify(notificationId);
    if (res.status && res.status === 200) {
      getNotification();
    }
  };

  const [totalUnRead, setTotalUnread] = useState(0);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const socket = socketIOClient(import.meta.env.VITE_API_SHOPPING_KEY);
  useEffect(() => {
    socket.on('newPlacedOrder', (message) => {
      getNotification();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const getNotification = async () => {
    const res = await orderApi.getAllNotify();
    if (res.status && res.status === 200) {
      setNotifications(res.data.data);
      setTotalUnread(res.data.data?.filter((item) => item.isRead === false).length);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications?.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification._id}
                massage={notification.massage}
                isRead={notification.isRead}
                detailId={notification.detailId}
                createdAt={notification.createdAt}
                openDetail={(event) => handleClick(event, notification.detailId, notification._id)}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications?.slice(2, 5).map((notification) => (
              <NotificationItem
                key={notification._id}
                massage={notification.massage}
                isRead={notification.isRead}
                detailId={notification.detailId}
                createdAt={notification.createdAt}
                openDetail={(event) => handleClick(event, notification.detailId, notification._id)}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
      <OrderDetailModal orderId={selectedOrder} open={openOrder} handleClose={handleCloseOrder} />
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  detailId: PropTypes.string,
  isRead: PropTypes.bool,
  massage: PropTypes.string,
  createdAt: PropTypes.string,
  openDetail: PropTypes.func,
};

function NotificationItem({ detailId, isRead, massage, createdAt, openDetail }) {
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!isRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={openDetail}
    >
      <ListItemText
        primary={<Typography variant="subtitle2">{massage}</Typography>}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            <span>{fToNow(createdAt)}</span>
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------
