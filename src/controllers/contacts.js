import {
  deleteContactById,
  getContactById,
  getContacts,
  patchContactById,
  postContact,
} from '../db/services/contacts.js';
import { notFoundHandler } from '../middlewares/notFoundHandler.js';

export const getContController = async (req, res) => {
  const contacts = await getContacts();

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
    notFoundHandler();
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
    notFoundHandler();
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
    notFoundHandler();
  }

  res.status(204).send();
};
