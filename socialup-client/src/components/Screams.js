import React from 'react';
import { useSelector } from 'react-redux';

import Scream from '../components/Scream';

export default function Screams() {
  const { screams, loading } = useSelector((state) => state.data);

  return !loading ? (
    screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    <p>Loading...</p>
  );
}
