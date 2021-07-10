import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// MUI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#068FB6',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#09AEE1',
      contrastText: '#FFFFFF'
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
