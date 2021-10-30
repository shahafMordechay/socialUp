import React, { useState } from 'react';

// MUI
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

// MUI Icons
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

// Redux
import { useDispatch } from 'react-redux';

import { deleteScream } from '../../redux/actions/dataActions';
import TooltipButton from '../../util/components/TooltipButton';

const styles = makeStyles({
  deleteButton: {
    position: 'absolute',
    right: '1%',
    top: '10%'
  }
});

export default function DeleteScream({ screamId }) {
  const message = `Are you sure you want to delete this scream?`;
  const warningMsg = `If deleted it cannot be restored!`;

  const classes = styles();

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteScream = () => {
    dispatch(deleteScream(screamId));
    setIsOpen(false);
  };

  return (
    <>
      <TooltipButton
        tip="Delete scream"
        onClick={handleOpen}
        btnClassName={classes.deleteButton}
      >
        <DeleteIcon color="primary" />
      </TooltipButton>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Delete the scream?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
            <br />
            {warningMsg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <TooltipButton tip="Delete" onClick={handleDeleteScream}>
            <DeleteForeverIcon color="secondary" />
          </TooltipButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
