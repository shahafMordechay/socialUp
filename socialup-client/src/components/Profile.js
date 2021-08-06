import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

// Redux
import { shallowEqual, useSelector } from 'react-redux';

import globalUseStyles from '../util/GlobalStyles';

export default function Profile() {
  const classes = globalUseStyles();

  const user = useSelector((state) => state.user, shallowEqual);
  const { authenticated, loading } = user;

  let ProfileMarkup = !loading ? (
    authenticated ? (
      authenticatedProfile(classes, user)
    ) : (
      noProfile(classes)
    )
  ) : (
    <p>loading...</p>
  );

  return ProfileMarkup;
}

const authenticatedProfile = (classes, user) => {
  const {
    credentials: { handle, createdAt, imageUrl, bio, website, location }
  } = user;

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/users/${handle}`}
            color="primary"
            variant="h5"
          >
            @{handle}
          </MuiLink>
          <hr />
          {bio && <Typography variant="body2">{bio}</Typography>}
          <hr />
          {location && (
            <>
              <LocationOn color="primary" />
              <span>{location}</span>
              <hr />
            </>
          )}
          {website && (
            <>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {' '}
                {website}
              </a>
            </>
          )}
          <CalendarToday color="primary" />{' '}
          <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
        </div>
      </div>
    </Paper>
  );
};

const noProfile = (classes) => {
  return (
    <Paper className={classes.paper}>
      <Typography variant="body2" align="center">
        No profile found, please login again
      </Typography>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/signup"
        >
          Signup
        </Button>
      </div>
    </Paper>
  );
};
