import React from 'react';

// MUI
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

import globalUseStyles from '../../util/styles/GlobalStyles';
import SingleTextForm from '../../util/components/SingleTextForm';

export default function CommentForm({ screamId }) {
  const classes = globalUseStyles();

  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.user.authenticated);

  const onSubmit = (data, event) => {
    event.preventDefault();
    dispatch(submitComment(screamId, data));
  };

  return authenticated ? (
    <Grid item sm={12} style={{ textAlign: 'center' }}>
      <Paper variant="outlined" className={classes.paper}>
        <SingleTextForm
          label="Comment your thoughts"
          rowsNumber="2"
          onSubmit={onSubmit}
          classes={classes}
        />
      </Paper>
      <hr className={classes.invisibleSeparator} />
      <hr className={classes.invisibleSeparator} />
    </Grid>
  ) : null;
}
