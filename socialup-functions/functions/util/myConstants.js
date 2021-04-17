const errorMessages = {
  GENERAL_ERROR: 'Something went wrong',
  MUST_NOT_BE_EMPTY: 'Must not be empty',
  UNAUTHORIZED: 'Unauthorized',
  WRONG_CREDENTIALS: 'Wrong credentials, please try again',
  TOKEN_NOT_FOUND: 'No token found',
  VERIFY_TOKEN_ERROR: 'Error on token verification ',
  SCREAM_CREATION_FAILED: 'Scream creation failed',
  SCREAM_NOT_FOUND: 'Scream not found',
  SCREAM_ALREADY_LIKED: 'Scream already liked',
  SCREAM_NOT_LIKED: 'Scream not liked',
  USER_NOT_FOUND: 'User not found',
  HANDLE_ALREADY_TAKEN: 'this handle is already taken',
  EMAIL_ALREADY_TAKEN: 'Email is already in use',
  WRONG_FILE_TYPE: 'Wrong file type submitted'
};

const messages = {
  SCREAM_DELETED: 'Scream deleted successfully',
  NOTIFICATION_READ: 'Notification marked read',
  IMAGE_UPLOADED: 'Image uploaded successfully',
  DETAILS_ADDED: 'Details added successfully'
};

const fbCollections = {
  USERS: 'users',
  SCREAMS: 'screams',
  COMMENTS: 'comments',
  LIKES: 'likes',
  NOTIFICATIONS: 'notifications'
};

module.exports = { errorMessages, messages, fbCollections };
