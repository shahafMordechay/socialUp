import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

import Scream from '../components/Scream';

export default function Home() {
  const [screams, setScreams] = useState(null);

  function getScreamsBody(screams) {
    return screams ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>Loading...</p>
    );
  }

  useEffect(() => {
    axios
      .get('/screams')
      .then((res) => {
        setScreams(res.data);
      })
      .catch((err) => console.error(err));
  });

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} xs={12}>
        {getScreamsBody(screams)}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>Profile...</p>
      </Grid>
    </Grid>
  );
}
