import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// MUI
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux
import { useDispatch, useSelector } from 'react-redux';

import globalUseStyles from '../util/GlobalStyles';
import AppIcon from '../images/clogo_only_trans.png';
import { loginUser } from '../redux/actions/userActions';

function Login(props) {
  const classes = globalUseStyles();

  const dispatch = useDispatch();
  const UI = useSelector((state) => state.UI);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const history = useHistory();

  const onSubmit = (data) => {
    loginUser(data, history, dispatch);
  };
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Paper variant="outlined" className={classes.paper}>
        <img src={AppIcon} alt="su" className={classes.image} />
        <Typography variant="h3" className={classes.pageTitle}>
          Login
        </Typography>
        <Container maxWidth="sm" className={classes.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            {UI.serverErrors && UI.serverErrors.general && (
              <Typography variant="body2" className={classes.customError}>
                {UI.serverErrors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              disabled={UI.loading}
            >
              Login
              {UI.loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Don't have an account? Sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Container>
      </Paper>
    </Container>
  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

export default Login;
