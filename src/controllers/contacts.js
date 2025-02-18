import {
  deleteContactById,
  getContactById,
  getContacts,
  patchContactById,
  postContact,
} from '../services/contacts.js';
import { notFoundContactHandler } from '../middlewares/notFoundContact.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    notFoundContactHandler();
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const postContController = async (req, res) => {
  const contacts = await postContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contacts,
  });
};

export const patchContController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const { contact } = await patchContactById(contactId, body);

  if (!contact) {
    notFoundContactHandler();
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactById(contactId);

  if (!contact) {
    notFoundContactHandler();
  }

  res.status(204).send();
};
