// error messages
const emptyErrMsg = 'Must not be empty';
const invalidEmailErrMsg = 'Email is invalid';
const passMatchErrMsg = 'Passwords must match';

/*===========================================================================*/
const isValidEmail = (email) => {
  const regEx = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  return email.match(regEx);
};

/*===========================================================================*/
const isEmpty = (string) => {
  return string.trim() === '';
};

/*===========================================================================*/
exports.validateSignupData = (userData) => {
  let errors = {};

  if (isEmpty(userData.email)) {
    errors.email = emptyErrMsg;
  } else if (!isValidEmail(userData.email)) {
    errors.email = invalidEmailErrMsg;
  }

  if (isEmpty(userData.password)) {
    errors.password = emptyErrMsg;
  }
  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = passMatchErrMsg;
  }

  if (isEmpty(userData.handle)) {
    errors.handle = emptyErrMsg;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

exports.validateLoginData = (userData) => {
  let errors = {};

  if (isEmpty(userData.email)) errors.email = emptyErrMsg;
  if (isEmpty(userData.password)) errors.password = emptyErrMsg;

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

/*===========================================================================*/
exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    let web = data.website;
    if (web.trim().substring(0, 4) !== 'http') {
      web = 'http://' + web.trim();
    }
    userDetails.website = web;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
