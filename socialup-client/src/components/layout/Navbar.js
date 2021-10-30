import React from 'react';
import { Link } from 'react-router-dom';

// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

// MUI Icons
import HomeIcon from '@material-ui/icons/Home';

// Redux
import { useSelector } from 'react-redux';

import TooltipButton from '../../util/components/TooltipButton';
import PostScream from '../scream/PostScream';
import Notifications from './Notifications';

export default function Navbar() {
  const { authenticated, loading } = useSelector((state) => state.user);
  return (
    <div>
      <AppBar>
        <Toolbar className="nav-container">
          {loading ? (
            <></>
          ) : authenticated ? (
            authenticatedNavbar()
          ) : (
            notAuthenticatedNavbar()
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const authenticatedNavbar = () => {
  return (
    <>
      <PostScream />
      <Link to="/">
        <TooltipButton tip="Home">
          <HomeIcon />
        </TooltipButton>
      </Link>
      <Notifications />
    </>
  );
};

const notAuthenticatedNavbar = () => (
  <>
    <Button color="inherit" component={Link} to="/">
      Home
    </Button>
    <Button color="inherit" component={Link} to="/login">
      Login
    </Button>
    <Button color="inherit" component={Link} to="/signup">
      Signup
    </Button>
  </>
);
