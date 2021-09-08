import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// MUI
import Grid from '@material-ui/core/Grid';

// Redux
import { useDispatch } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import axios from 'axios';

import Screams from '../components/scream/Screams';
import StaticProfile from '../components/profile/StaticProfile';

export default function User() {
  let { handle } = useParams();

  const [profile, setProfile] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData(handle));

    axios.get(`${handle}`).then((res) => {
      setProfile(res.data.user);
    });
  }, [dispatch, handle]);
  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        <Screams />
      </Grid>
      <Grid item sm={4} xs={12}>
        <StaticProfile profile={profile} />
      </Grid>
    </Grid>
  );
}
