import { React, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import globalUseStyles from '../util/GlobalStyles';
import { logoutUser, uploadImage } from '../redux/actions/userActions';
import EditDetails from './EditDetails';

export default function Profile() {
  const classes = globalUseStyles();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user, shallowEqual);
  const { authenticated, loading } = user;

  const imageInput = useRef(null);

  let ProfileMarkup = !loading ? (
    authenticated ? (
      authenticatedProfile(classes, user, imageInput, dispatch)
    ) : (
      noProfile(classes)
    )
  ) : (
    <p>loading...</p>
  );

  return ProfileMarkup;
}

const authenticatedProfile = (classes, user, imageInput, dispatch) => {
  const {
    credentials: { handle, createdAt, imageUrl, bio, website, location }
  } = user;

  const handleEditPicture = () => {
    imageInput.current && imageInput.current.click();
  };

  const handleImageChange = (event) => {
    handleImageUpload(event, dispatch);
  };

  const handleLogout = () => {
    handleUserLogout(dispatch);
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imageUrl} alt="profile" className="profile-image" />
          <input
            type="file"
            id="imageInput"
            ref={imageInput}
            hidden="hidden"
            onChange={(event) => handleImageChange(event)}
          />
          <Tooltip title="Edit profile picture" placement="top">
            <IconButton onClick={handleEditPicture} className="button">
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/users/${handle}`}
            color="primary"
            variant="h6"
          >
            @{handle}
          </MuiLink>
          <hr />
          {bio && <Typography variant="body2">{bio}</Typography>}
          <hr />
          {location && (
            <>
              <LocationOn color="primary" />
              <span>{location}</span>
              <hr />
            </>
          )}
          {website && (
            <>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {' '}
                {website}
              </a>
              <hr />
            </>
          )}
          <CalendarToday color="primary" />{' '}
          <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
        </div>
        <Tooltip title="Logout" placement="top">
          <IconButton onClick={handleLogout}>
            <KeyboardReturn color="primary" />
          </IconButton>
        </Tooltip>
        <EditDetails />
      </div>
    </Paper>
  );
};

const noProfile = (classes) => {
  return (
    <Paper className={classes.paper}>
      <Typography variant="body2" align="center">
        No profile found, please login again
      </Typography>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/signup"
        >
          Signup
        </Button>
      </div>
    </Paper>
  );
};

const handleImageUpload = (event, dispatch) => {
  const image = event.target.files[0];
  const formData = new FormData();
  formData.append('image', image, image.name);
  uploadImage(formData, dispatch);
};

const handleUserLogout = (dispatch) => {
  logoutUser(dispatch);
};
