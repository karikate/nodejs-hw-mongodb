import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

export const registerUser = async ({ name, email, password }) => {
  let user = await UserCollection.findOne({ email, password });
  if (user) throw createHttpError(409, 'Email in use');
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await UserCollection.create({ name, email, password: hashedPassword });
  return user;
};

export const loginUser = async ({ email, password }) => {
  let user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new createHttpError(401, 'Login or password is incorrect!');
  }
  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });
};

export const refreshUsersSession = async ({ sessionId, sessionToken }) => {
  if (!sessionId || !sessionToken) {
    throw createHttpError(400, 'Session ID or Session Token is missing');
  }
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
