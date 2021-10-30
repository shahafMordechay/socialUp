import React from 'react';
import { useSelector } from 'react-redux';

import Scream from './Scream';
import ScreamSkeleton from '../../util/components/ScreamSkeleton';

export default function Screams() {
  const { screams, loading } = useSelector((state) => state.data);

  return loading ? (
    <ScreamSkeleton />
  ) : screams === null ? (
    <p>no screams</p>
  ) : (
    screams.map((scream) => (
      <Scream key={scream.screamId} screamInfo={scream} />
    ))
  );
}
