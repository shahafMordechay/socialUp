import React from 'react';

// MUI
import Paper from '@material-ui/core/Paper';

// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

import noImg from '../../images/blank-profile-picture.png';
import globalUseStyles from '../styles/GlobalStyles';
import SkeletonStyle from '../styles/SkeletonStyle';

export default function ProfileSkeleton() {
  const globalClasses = globalUseStyles();
  const skeletonClasses = SkeletonStyle();

  return (
    <Paper className={globalClasses.paper}>
      <div className={globalClasses.profile}>
        <div className="image-wrapper">
          <img src={noImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={skeletonClasses.handle} />
          <hr />
          <div className={skeletonClasses.fullLine} />
          <div className={skeletonClasses.fullLine} />
          <hr />
          <LocationOn color="primary" /> <span> Location </span>
          <hr />
          <LinkIcon color="primary" /> https://website.com
          <hr />
          <CalendarToday color="primary" /> Joined Date
        </div>
      </div>
    </Paper>
  );
}
