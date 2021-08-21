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
    padding: 20
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
  },
  invisibleSeparator: {
    border: 'none',
    margin: 4
  },
  visibleSeparator: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    marginBottom: 20
  },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%'
      }
    },
    '& .profile-image': {
      width: 150,
      height: 150,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: '#00bcd4'
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  }
});

export default globalUseStyles;
