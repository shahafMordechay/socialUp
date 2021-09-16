import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';

// MUI
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import Badge from '@material-ui/core/Badge';

import { markNotificationsRead } from '../../redux/actions/userActions';

export default function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.user.notifications);

  dayjs.extend(relativeTime);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuOpened = () => {
    if (notifications && notifications.length > 0) {
      const unreadNotifications = notifications
        .filter((not) => not.read === false)
        .map((not) => not.notificationId);
      dispatch(markNotificationsRead(unreadNotifications));
    }
  };

  let notificationsIcon = <NotificationsIcon />;
  if (notifications && notifications.length > 0) {
    const unreadNotificationsCount = notifications.filter(
      (not) => not.read === false
    ).length;

    if (unreadNotificationsCount > 0)
      notificationsIcon = (
        <Badge badgeContent={unreadNotificationsCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      );
  }

  const notificationsMarkup =
    notifications && notifications.length > 0 ? (
      notifications.map((not) => {
        const verb = not.type === 'like' ? 'liked' : 'commented on';
        const time = dayjs(not.createdAt).fromNow();
        const iconColor = not.read ? 'primary' : 'secondary';
        const icon =
          not.type === 'like' ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );

        return (
          <MenuItem key={not.createdAt} onClick={handleClose}>
            {icon}
            <Typography
              component={Link}
              color="primary"
              variant="body1"
              to={`/user/${not.recipient}/scream/${not.screamId}`}
            >
              {not.sender} {verb} your scream {time}
            </Typography>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>You have no notifications yet</MenuItem>
    );

  return (
    <>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
}
