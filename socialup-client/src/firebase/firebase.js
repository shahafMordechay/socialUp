import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import config from './config';

firebase.initializeApp(config);
firebase.firestore();

export default firebase;
