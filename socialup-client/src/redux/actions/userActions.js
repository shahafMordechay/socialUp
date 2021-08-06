import axios from 'axios';
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from '../types';

const FB_ID_TOKEN = 'FBIdToken';
const AUTH = 'Authorization';

export const loginUser = (userData, history, dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('./login', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      getUserData(dispatch);
      dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = (dispatch) => {
  localStorage.removeItem(FB_ID_TOKEN);
  delete axios.defaults.headers.common[AUTH];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const signupUser = (newUserData, history, dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('./signup', newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      getUserData(dispatch);
      dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.data
      });
    });
};

export const getUserData = (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem(FB_ID_TOKEN, FBIdToken);
  axios.defaults.headers.common[AUTH] = FBIdToken;
};
