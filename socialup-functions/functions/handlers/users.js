const { admin, db } = require('../database/admin');

const config = require('../database/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require('../util/validators');

const {
  errorMessages,
  messages,
  fbCollections
} = require('../util/myConstants');

/*===========================================================================*/
// Create new user
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // validate user data
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  const blankProfilePic = 'blank-profile-picture.png';

  // add user to database
  let token, userId;
  db.doc(`/${fbCollections.USERS}/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: errorMessages.HANDLE_ALREADY_TAKEN });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${blankProfilePic}?alt=media`,
        userId
      };
      return db
        .doc(`/${fbCollections.USERS}/${newUser.handle}`)
        .set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res
          .status(400)
          .json({ email: errorMessages.EMAIL_ALREADY_TAKEN });
      } else {
        return res.status(500).json({ general: errorMessages.GENERAL_ERROR });
      }
    });
};

/*===========================================================================*/
// User login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // validate user data
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  // sign in by user email and password
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).json({ general: errorMessages.WRONG_CREDENTIALS });
    });
};

/*===========================================================================*/
// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/${fbCollections.USERS}/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.status(200).json({ message: messages.DETAILS_ADDED });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Get user screams
exports.getUserDetails = (req, res) => {
  let userData = {};

  db.doc(`/${fbCollections.USERS}/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.USER_NOT_FOUND });
      }

      userData.user = doc.data();
      return db
        .collection(fbCollections.SCREAMS)
        .where('userHandle', '==', req.params.handle)
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        let screamData = {};
        Object.assign(screamData, doc.data());
        screamData.screamId = doc.id;
        userData.screams.push(screamData);
      });
      return res.status(200).json(userData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Get user likes and notifications
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`/${fbCollections.USERS}/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.USER_NOT_FOUND });
      }

      userData.credentials = doc.data();
      return db
        .collection(fbCollections.LIKES)
        .where('userHandle', '==', req.user.handle)
        .get();
    })
    .then((docs) => {
      userData.likes = [];
      docs.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection(fbCollections.NOTIFICATIONS)
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = {};
      data.forEach((doc) => {
        let notificationData = {};
        Object.assign(notificationData, doc.data());
        notificationData.notificationId = doc.id;
        userData.notifications.push(notificationData);
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Upload profile picture for user
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFilename;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // file is not an image
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: errorMessages.WRONG_FILE_TYPE });
    }

    // build random file name and path
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFilename = `${Math.round(
      Math.random() * 10000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFilename);

    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on('finish', () => {
    // upload image to firebase storage and save url in user doc
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media`;
        return db
          .doc(`/${fbCollections.USERS}/${req.user.handle}`)
          .update({ imageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: messages.IMAGE_UPLOADED });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

/*===========================================================================*/
// Mark user notifications as read
exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(
      `/${fbCollections.NOTIFICATIONS}/${notificationId}`
    );
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.status(200).json({ message: messages.NOTIFICATION_READ });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
