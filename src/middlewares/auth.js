const jwt = require('jsonwebtoken');

const {
  returningError
} = require('../helpers/showResponse');
const {
  APP_SECRET
} = process.env;

const verify = (req, res) => {
  try {
    const authHead = req.headers.authorization;

    if (!authHead) {
      return false;
    }

    if (!authHead.startsWith('Bearer')) {
      return false;
    }

    const token = authHead.split(' ').pop();

    const decoded = jwt.verify(token, APP_SECRET);

    if (!decoded) {
      return false;
    }

    return decoded;
  } catch (error) {
    console.error(error);
    return returningError(res, 500, 'Unexpected error');
  }
};

exports.verifyAdmin = (req, res, next) => {
  try {
    const verifyUser = verify(req, res);

    if (!verifyUser) {
      return returningError(res, 401, 'Unauthorized');
    }

    if (verifyUser.role !== 'admin') {
      return returningError(res, 403, 'Just admin can do this');
    }

    next();
  } catch (error) {
    console.error(error);
    return returningError(res, 500, 'Unexpected error');
  }
};

exports.verifyUser = (req, res, next) => {
  try {
    const verifyUser = verify(req, res);

    // console.log(verifyUser);

    // check if user is confirmed
    if (!verifyUser.confirm) {
      return returningError(res, 403, 'User not confirmed');
    }

    if (!verifyUser) {
      return returningError(res, 401, 'Unauthorized');
    }

    // put user data to headers object
    req.headers.user = {
      id: String(verifyUser.id),
      role: verifyUser.role,
      userProfileId: verifyUser.userProfileId,
    };

    console.log(req.headers.user);

    next();
  } catch (error) {
    console.error(error);
    return returningError(res, 500, 'Unexpected error');
  }
};
