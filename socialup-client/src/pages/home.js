import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

function getScreamsBody(screams) {
  return screams ? (
    screams.map((scream) => <p>{scream.body}</p>)
  ) : (
    <p>Loading...</p>
  );
}

export default function Home() {
  const [screams, setScreams] = useState(null);

  useEffect(() => {
    axios
      .get('/screams')
      .then((res) => {
        setScreams(res.data);
      })
      .catch((err) => console.error(err));
  });

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item sm={8} xs={12}>
          {getScreamsBody(screams)}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    </div>
  );
}
