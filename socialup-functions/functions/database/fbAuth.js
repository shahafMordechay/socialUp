const { admin, db } = require('./admin');
const { errorMessages, fbCollections } = require('../util/functionsConstants');

const tokenPrefix = 'Bearer ';
/*===========================================================================*/
/* User token authentication */
module.exports = (req, res, next) => {
  let idToken;

  // extract token from request
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(tokenPrefix)
  ) {
    idToken = req.headers.authorization.split(tokenPrefix)[1];
  } else {
    console.error(errorMessages.TOKEN_NOT_FOUND);
    res.status(403).json({ error: errorMessages.UNAUTHORIZED });
  }

  // authenticate token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection(fbCollections.USERS)
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch((err) => {
      console.error(errorMessages.VERIFY_TOKEN_ERROR, err);
      return res.status(403).json(err);
    });
};
