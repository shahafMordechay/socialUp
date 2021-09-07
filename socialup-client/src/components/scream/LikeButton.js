import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// MUI Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import TooltipButton from '../../util/TooltipButton';

export default function LikeButton({ onLike, onUnlike, isLiked }) {
  const { authenticated } = useSelector((state) => state.user);

  const renderNotAuthenticated = () => {
    return (
      <TooltipButton tip="like">
        <Link to="/login">
          <FavoriteBorderIcon color="primary" />
        </Link>
      </TooltipButton>
    );
  };

  const renderAuthenticated = () => {
    return isLiked ? (
      <TooltipButton tip="Unlike" onClick={onUnlike}>
        <FavoriteIcon color="primary" />
      </TooltipButton>
    ) : (
      <TooltipButton tip="Like" onClick={onLike}>
        <FavoriteBorderIcon color="primary" />
      </TooltipButton>
    );
  };

  return !authenticated ? renderNotAuthenticated() : renderAuthenticated();
}
