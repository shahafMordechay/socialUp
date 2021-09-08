import React, { useState } from 'react';

// MUI
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// MUI Icons
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, postScream } from '../../redux/actions/dataActions';

import GlobalStyles from '../../util/GlobalStyles';
import TooltipButton from '../../util/TooltipButton';
import SingleTextForm from '../../util/SingleTextForm';

export default function PostScream() {
  const classes = GlobalStyles();

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const {
    credentials: { handle, imageUrl }
  } = useSelector((state) => state.user);

  const onSubmit = (data, event) => {
    const newScream = {
      body: data.body,
      handle: handle,
      imageUrl: imageUrl
    };

    event.preventDefault();
    dispatch(postScream(newScream));
    handleClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    dispatch(clearErrors());
    setIsOpen(false);
  };

  return (
    <>
      <TooltipButton tip="Post a scream" onClick={handleOpen}>
        <AddIcon />
      </TooltipButton>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <TooltipButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </TooltipButton>
        <DialogTitle>Post a new scream</DialogTitle>
        <DialogContent>
          <SingleTextForm
            label="Scream"
            placeholder="Scream what's on your mind"
            rowsNumber="5"
            onSubmit={onSubmit}
            classes={classes}
            style={{ textAlign: 'center' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
