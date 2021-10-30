import React from 'react';
import { Controller, useForm } from 'react-hook-form';

//MUI
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { useSelector } from 'react-redux';

export default function SingleTextForm({
  label,
  placeholder,
  rowsNumber,
  onSubmit,
  classes,
  style
}) {
  const { loading } = useSelector((state) => state.UI);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      body: ''
    }
  });

  const handleOnSubmit = (data, event) => {
    onSubmit(data, event);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} style={style}>
      <Grid container spacing={0}>
        <Grid item sm={12}>
          <Controller
            required
            control={control}
            id="body"
            name="body"
            className={classes.TextField}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  id="body"
                  type="text"
                  label={label}
                  color="primary"
                  inputRef={register('body', {
                    required: 'Cannot be empty'
                  })}
                  error={errors.body ? true : false}
                  helperText={errors && errors.body && errors.body.message}
                  placeholder={placeholder}
                  rows={rowsNumber}
                  multiline
                  fullWidth
                />
              );
            }}
          />
        </Grid>
        <Grid item sm={12}>
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
        </Grid>
      </Grid>
    </form>
  );
}
