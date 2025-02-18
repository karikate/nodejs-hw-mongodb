import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

import { serializeUser } from '../utils/serializeUser.js';

const setupSession = (res, session) => {
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    // expires: session.refreshTokenValidUntil,
    expires: new Date(Date.now() + 100000000000),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    // expires: session.refreshTokenValidUntil,
    expires: new Date(Date.now() + 100000000000),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: serializeUser(user),
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    // expires: new Date(Date.now() + 100000000000),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    // expires: new Date(Date.now() + 100000000000),
  });
  // setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      sessionId: session._id,
      sessionToken: session.refreshToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;

  const session = await refreshUsersSession({
    sessionId,
    sessionToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
