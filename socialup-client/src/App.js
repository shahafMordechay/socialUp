import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import jwtDecode from 'jwt-decode';

// MUI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// Firebase
import firebase from './firebase/firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

// Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/components/AuthRoute';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';

// style
import defaultTheme from './util/styles/theme';
import axios from 'axios';

const theme = createMuiTheme(defaultTheme);

axios.defaults.baseURL =
  'https://us-central1-socialape-mor.cloudfunctions.net/api';

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

const rrfProps = {
  firebase,
  config: {
    userProfile: 'users'
  },
  dispatch: store.dispatch,
  createFirestoreInstance
};

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/signup" component={Signup} />
                <Route exact path="/user/:handle" component={User} />
                <Route
                  exact
                  path="/user/:handle/scream/:screamId"
                  component={User}
                />
              </Switch>
            </div>
          </Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
