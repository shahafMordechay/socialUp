import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

// MUI Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

import TooltipButton from '../../util/TooltipButton';
import LikeButton from './LikeButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';

const { fbCollections } = require('../../util/clientConstants');

const styles = makeStyles({
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200,
    margin: 5
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
});

function Scream(screamInfo) {
  const classes = styles();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const {
    scream: {
      body,
      createdAt,
      userImage,
      userHandle,
      screamId,
      likeCount,
      commentCount
    }
  } = screamInfo;

  dayjs.extend(relativeTime);

  const isScreamLiked =
    user.likes && user.likes.find((like) => like.screamId === screamId);

  const handleLikeScream = () => {
    dispatch(likeScream(screamId));
  };

  const handleUnlikeScream = () => {
    dispatch(unlikeScream(screamId));
  };

  const renderScreamDelete = () => {
    return userHandle === user.credentials.handle ? (
      <DeleteScream screamId={screamId} />
    ) : null;
  };

  return (
    <Card className={classes.card}>
      <CardMedia
        image={userImage}
        title="Profile image"
        className={classes.image}
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`${fbCollections.USERS}/${userHandle}`}
          color="primary"
        >
          {userHandle}
        </Typography>
        <br />
        {renderScreamDelete()}
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
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
        <ScreamDialog screamId={screamId} userHandle={userHandle} />
      </CardContent>
    </Card>
  );
}

export default Scream;
