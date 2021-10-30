import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Card from '@material-ui/core/Card';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

import globalUseStyles from '../../util/styles/GlobalStyles';

export default function StaticProfile({ profile }) {
  const classes = globalUseStyles();

  const { handle, createdAt, imageUrl, bio, website, location } = profile;

  return (
    <Card className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/user/${handle}`}
            color="primary"
            variant="h6"
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
              <hr />
            </>
          )}
          <CalendarToday color="primary" />{' '}
          <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
        </div>
      </div>
    </Card>
  );
}
