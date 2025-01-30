import createHttpError from 'http-errors';
import { ContactsCollection } from '../models/contact.js';

export const getContacts = async () => {
  const contacts = await ContactsCollection.find();

  return contacts;
};
export const postContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);

  return contact;
};

export const patchContactById = async (contactId, payload, options = {}) => {
  const response = await ContactsCollection.findByIdAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  const contact = response.value;
  const isNew = !response.lastErrorObject.updatedExisting;

  if (!contact) {
    throw new createHttpError(404, 'Student not found');
  }

  return {
    contact,
    isNew,
  };
};

export const deleteContactById = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);

  return contact;
};
