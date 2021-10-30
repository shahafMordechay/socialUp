import React, { useState, useLayoutEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getScream,
  likeScream,
  unlikeScream
} from '../../redux/actions/dataActions';

import TooltipButton from '../../util/components/TooltipButton';
import LikeButton from './LikeButton';
import globalUseStyles from '../../util/styles/GlobalStyles';
import Comments from './Comments';
import CommentForm from './CommentForm';

export default function ScreamDialog({ screamId, userHandle, openDialog }) {
  const classes = globalUseStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [oldPath, setOldPath] = useState('');
  const [newPath, setNewPath] = useState('');

  const dispatch = useDispatch();
  const UI = useSelector((state) => state.UI);
  const user = useSelector((state) => state.user);
  const { body, createdAt, likeCount, commentCount, userImage, comments } =
    useSelector((state) => state.data.scream);

  const handleOpen = useCallback(() => {
    const currentOldPath = window.location.pathname;
    const currentNewPath = `/user/${userHandle}/scream/${screamId}`;
    window.history.pushState(null, null, currentNewPath);

    if (currentOldPath === newPath) setOldPath(`/user/${userHandle}`);
    else setOldPath(currentOldPath);

    setNewPath(currentNewPath);
    setIsOpen(true);
    dispatch(getScream(screamId));
  }, [userHandle, screamId, newPath, dispatch]);

  const handleClose = () => {
    window.history.pushState(null, null, oldPath);
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (openDialog) handleOpen();
  }, [handleOpen, openDialog]);

  const isScreamLiked =
    user.likes && user.likes.find((like) => like.screamId === screamId);

  const handleLikeScream = () => {
    dispatch(likeScream(screamId));
  };

  const handleUnlikeScream = () => {
    dispatch(unlikeScream(screamId));
  };

  const renderDialogMarkup = () => {
    return (
      <>
        <TooltipButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </TooltipButton>
        <Grid container spacing={2}>
          <Grid item sm={5}>
            <div className={classes.profile}>
              <img src={userImage} alt="Profile" className="profile-image" />
            </div>
          </Grid>
          <Grid item sm={7}>
            <Typography
              component={Link}
              color="primary"
              variant="h5"
              to={`/users/${userHandle}`}
            >
              @{userHandle}
            </Typography>
            <hr className={classes.invisibleSeparator} />
            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
            </Typography>
            <hr className={classes.invisibleSeparator} />
            <Typography variant="body1">{body}</Typography>
            <LikeButton
              onLike={handleLikeScream}
              onUnlike={handleUnlikeScream}
              isLiked={isScreamLiked}
            />
            <span>{likeCount} likes</span>
            <TooltipButton tip="comments">
              <ChatIcon color="primary" />
            </TooltipButton>
            <span>{commentCount} comments</span>
          </Grid>
          <hr className={classes.invisibleSeparator} />
          <CommentForm screamId={screamId} />
          <Comments comments={comments} />
        </Grid>
      </>
    );
  };

  const dialogMarkup = UI.loading ? (
    <div className={classes.spinnerWrapper}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    renderDialogMarkup()
  );

  return (
    <>
      <TooltipButton
        onClick={handleOpen}
        tip="Expand scream"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore color="primary" />
      </TooltipButton>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </>
  );
}
