import { React, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// MUI Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import PhotoCameraTwoToneIcon from '@material-ui/icons/PhotoCameraTwoTone';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// Redux
import { useDispatch, shallowEqual, useSelector } from 'react-redux';

import globalUseStyles from '../util/GlobalStyles';
import { logoutUser, uploadImage } from '../redux/actions/userActions';
import EditDetails from './EditDetails';
import TooltipButton from '../components/TooltipButton';

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
    <Card className={classes.paper}>
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
          <TooltipButton
            tip="Edit profile picture"
            placement="top"
            btnClassName="button"
            onClick={handleEditPicture}
          >
            <PhotoCameraTwoToneIcon color="primary" />
          </TooltipButton>
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/user/${handle}`}
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
        <TooltipButton tip="Logout" placement="top" onClick={handleLogout}>
          <KeyboardReturn color="primary" />
        </TooltipButton>
        <EditDetails />
      </div>
    </Card>
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
  dispatch(uploadImage(formData));
};

const handleUserLogout = (dispatch) => {
  dispatch(logoutUser());
};
