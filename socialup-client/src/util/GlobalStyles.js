import { makeStyles } from '@material-ui/core';

const globalUseStyles = makeStyles({
  typography: {
    useNextVariant: true
  },
  form: {
    textAlign: 'center',
    width: 384
  },
  container: {
    textAlign: 'center'
  },
  paper: {
    height: '600px'
  },
  image: {
    margin: '20px auto 10px auto',
    width: 128,
    height: 128
  },
  pageTitle: {
    margin: 'auto auto 10px auto'
  },
  textField: {
    margin: '30px auto 30px auto'
  },
  button: {
    marginTop: '30px'
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '15px'
  },
  progress: {
    position: 'absolute'
  }
});

export default globalUseStyles;
