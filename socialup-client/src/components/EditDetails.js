import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// MUI Icons
import EditIcon from '@material-ui/icons/Edit';

// Redux
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import globalUseStyles from '../util/GlobalStyles';
import { editUserDetails } from '../redux/actions/userActions';
import TooltipButton from '../components/TooltipButton';

export default function EditDetails() {
  const classes = globalUseStyles();
  const buttonStyle = { float: 'right' };

  const dispatch = useDispatch();
  const credentials = useSelector(
    (state) => state.user.credentials,
    shallowEqual
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  const submitButton = useRef(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    submitButton.current && submitButton.current.click();
  };

  const onSubmit = (formData) => {
    editUserDetails(formData, dispatch);
    handleClose();
  };

  const { control, handleSubmit } = useForm({
    defaultValues: {
      bio: credentials.bio ? credentials.bio : '',
      website: credentials.website ? credentials.website : '',
      location: credentials.location ? credentials.location : ''
    }
  });

  return (
    <>
      <TooltipButton
        tip="Edit details"
        placement="top"
        btnClassName={classes.button}
        onClick={handleOpen}
        style={buttonStyle}
      >
        <EditIcon color="primary" />
      </TooltipButton>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              required
              control={control}
              id="bio"
              name="bio"
              className={classes.textField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="bio"
                    type="text"
                    label="Bio"
                    multiline
                    rows="3"
                    placeholder="A short bio about yourself"
                    fullWidth
                  />
                );
              }}
            />
            <Controller
              required
              control={control}
              id="website"
              name="website"
              className={classes.textField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="website"
                    type="text"
                    label="Website"
                    placeholder="Your personal/professional website"
                    fullWidth
                  />
                );
              }}
            />
            <Controller
              required
              control={control}
              id="location"
              name="location"
              className={classes.textField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="location"
                    type="text"
                    label="Location"
                    placeholder="Where you live"
                    fullWidth
                  />
                );
              }}
            />
            <Button
              id="submitButton"
              type="submit"
              hidden="hidden"
              ref={submitButton}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
