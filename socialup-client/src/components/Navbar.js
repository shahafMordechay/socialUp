import React from 'react';

// MUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

// MUI Icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

// Redux
import { useSelector } from 'react-redux';
import TooltipButton from '../components/TooltipButton';

export default function Navbar() {
  const authenticated = useSelector((state) => state.user.authenticated);

  return (
    <div>
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? authenticatedNavbar() : notAuthenticatedNavbar()}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const authenticatedNavbar = () => {
  return (
    <>
      <TooltipButton tip="Post a scream">
        <AddIcon />
      </TooltipButton>
      <Link to="/">
        <TooltipButton tip="Home">
          <HomeIcon />
        </TooltipButton>
      </Link>
      <TooltipButton tip="Notifications">
        <Notifications />
      </TooltipButton>
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
