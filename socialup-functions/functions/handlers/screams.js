const { db } = require('../database/admin');
const {
  errorMessages,
  messages,
  fbCollections
} = require('../util/functionsConstants');

/*===========================================================================*/
// Get all screams in db
exports.getAllScreams = (req, res) => {
  db.collection(fbCollections.SCREAMS)
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        let screamData = {};
        Object.assign(screamData, doc.data());
        screamData.screamId = doc.id;
        screams.push(screamData);
      });
      return res.status(200).json(screams);
    })
    .catch((err) => console.error(err));
};

/*===========================================================================*/
// Create new scream
exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: errorMessages.MUST_NOT_BE_EMPTY });
  }

  // build scream object
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  // add scream to screams collection
  db.collection(fbCollections.SCREAMS)
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.status(200).json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: errorMessages.SCREAM_CREATION_FAILED });
      console.log(err);
    });
};

/*===========================================================================*/
// Get one scream
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/${fbCollections.SCREAMS}/${req.params.screamId}`)
    .get()
    .then((doc) => {
      // return sorted scream comments only if scream exist
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.SCREAM_NOT_FOUND });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection(fbCollections.COMMENTS)
        .orderBy('createdAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get();
    })
    .then((data) => {
      // return scream data with all comment sorted(desc)
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Comment a scream
exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ comment: errorMessages.MUST_NOT_BE_EMPTY });
  }

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/${fbCollections.SCREAMS}/${req.params.screamId}`)
    .get()
    .then((doc) => {
      // add comment only if scream exists
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.SCREAM_NOT_FOUND });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection(fbCollections.COMMENTS).add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Like a scream
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection(fbCollections.LIKES)
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(
    `/${fbCollections.SCREAMS}/${req.params.screamId}`
  );

  let screamData = {};

  screamDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.SCREAM_NOT_FOUND });
      }

      screamData = doc.data();
      screamData.screamId = doc.id;
      return likeDocument.get();
    })
    .then((data) => {
      if (!data.empty) {
        return res
          .status(400)
          .json({ error: errorMessages.SCREAM_ALREADY_LIKED });
      }

      // add like to scream
      return db
        .collection(fbCollections.LIKES)
        .add({
          screamId: req.params.screamId,
          userHandle: req.user.handle
        })
        .then(() => {
          screamData.likeCount++;
          return screamDocument.update({ likeCount: screamData.likeCount });
        })
        .then(() => {
          return res.status(200).json(screamData);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Unlike a scream
exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection(fbCollections.LIKES)
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(
    `/${fbCollections.SCREAMS}/${req.params.screamId}`
  );

  let screamData = {};

  screamDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.SCREAM_NOT_FOUND });
      }

      screamData = doc.data();
      screamData.screamId = doc.id;
      return likeDocument.get();
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: errorMessages.SCREAM_NOT_LIKED });
      }

      // unlike a scream
      return db
        .doc(`/${fbCollections.LIKES}/${data.docs[0].id}`)
        .delete()
        .then(() => {
          screamData.likeCount--;
          return screamDocument.update({ likeCount: screamData.likeCount });
        })
        .then(() => {
          res.status(200).json(screamData);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.code });
    });
};

/*===========================================================================*/
// Delete a scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/${fbCollections.SCREAMS}/${req.params.screamId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: errorMessages.SCREAM_NOT_FOUND });
      }

      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: errorMessages.UNAUTHORIZED });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.status(200).json({ message: messages.SCREAM_DELETED });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};
