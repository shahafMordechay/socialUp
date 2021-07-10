import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';

// MUI
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import globalUseStyles from '../util/GlobalStyles';
import AppIcon from '../images/clogo_only_trans.png';

function Signup(props) {
  const classes = globalUseStyles();

  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      handle: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const history = useHistory();

  const onSubmit = (data) => {
    console.log('sub start');
    setLoading(true);
    axios
      .post('./signup', data)
      .then((res) => {
        console.log('sub success');
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        setLoading(false);
        history.push('/');
      })
      .catch((err) => {
        console.log(err.response.data);
        setServerErrors({
          general: {
            type: 'server',
            message: err.response.data.general
          }
        });
        setLoading(false);
      });
  };
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Paper variant="outlined" className={classes.paper}>
        <img src={AppIcon} alt="su" className={classes.image} />
        <Typography variant="h3" className={classes.pageTitle}>
          Signup
        </Typography>
        <Container maxWidth="sm" className={classes.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              required
              control={control}
              id="handle"
              name="handle"
              className={classes.TextField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="handle"
                    type="text"
                    label="Username"
                    color="secondary"
                    fullWidth
                    error={errors.handle ? true : false}
                    helperText={
                      errors && errors.handle && errors.handle.message
                    }
                    inputRef={register('handle', {
                      required: 'Must not be empty!',
                      minLength: {
                        value: 3,
                        message: 'Username should be at-least 3 characters.'
                      }
                    })}
                  />
                );
              }}
            />
            <Controller
              required
              control={control}
              id="email"
              name="email"
              className={classes.TextField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="email"
                    type="email"
                    label="Email"
                    color="secondary"
                    fullWidth
                    error={errors.email ? true : false}
                    helperText={errors && errors.email && errors.email.message}
                    inputRef={register('email', {
                      required: 'You must provide the email address!',
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: 'You must provide a valid email address!'
                      }
                    })}
                  />
                );
              }}
            />
            <Controller
              required
              control={control}
              id="password"
              name="password"
              className={classes.TextField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="password"
                    type="password"
                    label="Password"
                    color="secondary"
                    fullWidth
                    error={errors.password ? true : false}
                    helperText={
                      errors && errors.password && errors.password.message
                    }
                    inputRef={register('password', {
                      required: 'You must provide a password!',
                      minLength: {
                        value: 6,
                        message: 'Password should be at-least 6 characters.'
                      }
                    })}
                  />
                );
              }}
            />
            <Controller
              required
              control={control}
              id="confirmPassword"
              name="confirmPassword"
              className={classes.TextField}
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    id="confirmPassword"
                    type="password"
                    label="ConfirmPassword"
                    color="secondary"
                    fullWidth
                    error={errors.confirmPassword ? true : false}
                    helperText={
                      errors &&
                      errors.confirmPassword &&
                      errors.confirmPassword.message
                    }
                    inputRef={register('confirmPassword', {
                      required: 'You must confirm the password!',
                      minLength: {
                        value: 6,
                        message: 'Password should be at-least 6 characters.'
                      }
                    })}
                  />
                );
              }}
            />
            {serverErrors && serverErrors.general && (
              <Typography variant="body2" className={classes.customError}>
                {serverErrors.general.message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Already have an account? login <Link to="/login">here</Link>
            </small>
          </form>
        </Container>
      </Paper>
    </Container>
  );
}

export default Signup;
