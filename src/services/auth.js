import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { sendEmail } from '../utils/transporter.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';
import { TEMPLATES_DIR } from '../constants/templates.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

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

export const sendResetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw new createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPassTemplatesPath = path.join(
    TEMPLATES_DIR,
    'resetPassTemplate.html',
  );

  const templateSource = (await fs.readFile(resetPassTemplatesPath)).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar(ENV_VARS.APP_DOMAIN)}/reset-pwd?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(ENV_VARS.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async ({ token, password }) => {
  let entries;

  try {
    entries = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
  });

  if (!user) {
    throw new createHttpError(404, 'User not found');
  }
  await SessionsCollection.deleteOne({ email: entries.email });
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
};
