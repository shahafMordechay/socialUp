import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// MUI Icons
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, postScream } from '../../redux/actions/dataActions';

import GlobalStyles from '../../util/GlobalStyles';
import TooltipButton from '../../util/TooltipButton';

export default function PostScream() {
  const classes = GlobalStyles();

  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.UI);

  const {
    credentials: { handle, imageUrl }
  } = useSelector((state) => state.user);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      screamContent: ''
    }
  });

  const onSubmit = (data) => {
    const newScream = {
      body: data.screamContent,
      handle: handle,
      imageUrl: imageUrl
    };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              required
              control={control}
              id="screamContent"
              name="screamContent"
              className={classes.TextField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="screamContent"
                    type="text"
                    label="Scream"
                    color="primary"
                    inputRef={register('screamContent', {
                      required: 'Scream cannot be empty'
                    })}
                    error={errors.screamContent ? true : false}
                    helperText={
                      errors &&
                      errors.screamContent &&
                      errors.screamContent.message
                    }
                    placeholder="Scream what's on your mind"
                    rows="5"
                    multiline
                    fullWidth
                  />
                );
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.postButton}
              disabled={loading}
            >
              Post
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
