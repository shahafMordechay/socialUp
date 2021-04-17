const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./database/fbAuth');

const { db } = require('./database/admin');

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require('./handlers/screams');

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require('./handlers/users');

const { fbCollections } = require('./util/myConstants');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// Users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

const funcRegion = 'us-central1';

// Triggers
exports.createNotificationOnLike = functions
  .region(funcRegion)
  .firestore.document(`${fbCollections.LIKES}/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/${fbCollections.SCREAMS}/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/${fbCollections.NOTIFICATIONS}/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnLike = functions
  .region(funcRegion)
  .firestore.document(`${fbCollections.LIKES}/{id}`)
  .onDelete((snapshot) => {
    return db
      .doc(`/${fbCollections.NOTIFICATIONS}/${snapshot.id}`)
      .delete()
      .catch((err) => console.error(err));
  });

exports.createNotificationOnComment = functions
  .region(funcRegion)
  .firestore.document(`${fbCollections.COMMENTS}/{id}`)
  .onCreate((snapshot) => {
    return db
      .doc(`/${fbCollections.SCREAMS}/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/${fbCollections.NOTIFICATIONS}/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.onUserImageChange = functions
  .region(funcRegion)
  .firestore.document(`/${fbCollections.USERS}/{userId}`)
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection(fbCollections.SCREAMS)
        .where('userHandle', '==', change.before.data().userHandle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/${fbCollections.SCREAMS}/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.OnScreamDelete = functions
  .region(funcRegion)
  .firestore.document(`${fbCollections.SCREAMS}/{screamId}`)
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection(`${fbCollections.COMMENTS}`)
      .where('screamId', '==', screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/${fbCollections.COMMENTS}/${doc.id}`));
        });
        return db
          .collection(fbCollections.LIKES)
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/${fbCollections.LIKES}/${doc.id}`));
        });
        return db
          .collection(`${fbCollections.NOTIFICATIONS}`)
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/${fbCollections.NOTIFICATIONS}/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
