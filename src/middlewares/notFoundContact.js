import createHttpError from 'http-errors';

export const notFoundContactHandler = (req, res, next) => {
  throw createHttpError(404, 'Contact not found');
};
