import axios from 'axios';

import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  SET_NOTIFICATIONS
} from '../types';

const FB_ID_TOKEN = 'FBIdToken';
const AUTH = 'Authorization';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('./login', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
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

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(FB_ID_TOKEN);
  delete axios.defaults.headers.common[AUTH];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('./signup', newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
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

export const getUserData = () => (dispatch) => {
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

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user/image', formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .post('/user', userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const addNotificationListener =
  ({ firestore }, userHandle) =>
  (dispatch) => {
    const unsubscribe = firestore.onSnapshot(
      {
        collection: 'notifications',
        where: [
          ['recipient', '==', userHandle],
          ['read', '==', false]
        ],
        orderBy: ['createdAt', 'desc'],
        limit: 10
      },
      (querySnapshot) => {
        let nots = [];

        querySnapshot.docs.forEach((doc) => {
          let notificationData = {};

          Object.assign(notificationData, doc.data());
          notificationData.notificationId = doc.id;
          nots.push(notificationData);
        });

        dispatch({ type: SET_NOTIFICATIONS, payload: nots });
      }
    );

    return unsubscribe;
  };

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios
    .post('notifications', notificationIds)
    .then((res) => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem(FB_ID_TOKEN, FBIdToken);
  axios.defaults.headers.common[AUTH] = FBIdToken;
};
