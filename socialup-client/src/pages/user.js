import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// MUI
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import axios from 'axios';

import Screams from '../components/scream/Screams';
import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import globalUseStyles from '../util/GlobalStyles';

export default function User() {
  const classes = globalUseStyles();
  let { handle, screamId } = useParams();

  const [profile, setProfile] = useState(null);

  const dispatch = useDispatch();
  const { screams } = useSelector((state) => state.data);

  useLayoutEffect(() => {
    dispatch(getUserData(handle));

    axios.get(`/user/${handle}`).then((res) => {
      setProfile(res.data.user);
    });
  }, [dispatch, handle]);

  const renderScreams = (screamId) => {
    if (!screamId) return <Screams />;
    else {
      return screams.map((scream) => {
        if (scream.screamId !== screamId)
          return <Scream key={scream.screamId} screamInfo={scream} />;
        else {
          return (
            <Scream key={scream.screamId} screamInfo={scream} dialogOpen />
          );
        }
      });
    }
  };
  const userPage = !profile ? (
    <div className={classes.spinnerWrapper}>
      <CircularProgress size={300} thickness={2} style={{ margin: 'auto' }} />
    </div>
  ) : (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {renderScreams(screamId)}
      </Grid>
      <Grid item sm={4} xs={12}>
        <StaticProfile profile={profile} />
      </Grid>
    </Grid>
  );

  return userPage;
}
