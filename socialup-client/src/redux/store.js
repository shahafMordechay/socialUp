import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import userReducer from './reducers/userReducer';
import uiReducer from './reducers/uiReducer';
import dataReducer from './reducers/dataReducer';

const initialState = {};

const devTools =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : null;

const enhancer =
  process.env.NODE_ENV === 'development'
    ? compose(applyMiddleware(thunk), devTools)
    : compose(applyMiddleware(thunk));

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: uiReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

const store = createStore(reducers, initialState, enhancer);

export default store;
