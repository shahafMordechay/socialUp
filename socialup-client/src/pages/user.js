import React, { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// MUI
import Grid from '@material-ui/core/Grid';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

import axios from 'axios';

import Screams from '../components/scream/Screams';
import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
import ScreamSkeleton from '../util/components/ScreamSkeleton';
import ProfileSkeleton from '../util/components/ProfileSkeleton';

export default function User() {
  let { handle, screamId } = useParams();

  const [profile, setProfile] = useState(null);

  const dispatch = useDispatch();
  const { screams, loading } = useSelector((state) => state.data);

  useLayoutEffect(() => {
    dispatch(getUserData(handle));

    axios.get(`/user/${handle}`).then((res) => {
      setProfile(res.data.user);
    });
  }, [dispatch, handle]);

  const renderScreams = loading ? (
    <ScreamSkeleton />
  ) : !screamId ? (
    <Screams />
  ) : (
    screams.map((scream) => {
      if (scream.screamId !== screamId)
        return <Scream key={scream.screamId} screamInfo={scream} />;
      else {
        return <Scream key={scream.screamId} screamInfo={scream} dialogOpen />;
      }
    })
  );

  const renderProfile = !profile ? (
    <ProfileSkeleton />
  ) : (
    <StaticProfile profile={profile} />
  );

  const userPage = (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {renderScreams}
      </Grid>
      <Grid item sm={4} xs={12}>
        {renderProfile}
      </Grid>
    </Grid>
  );

  return userPage;
}
