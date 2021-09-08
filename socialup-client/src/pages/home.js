import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

import Profile from '../components/profile/Profile';
import Screams from '../components/scream/Screams';

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getScreams());
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <Screams />
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
}
