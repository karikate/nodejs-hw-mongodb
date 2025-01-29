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

export const deleteContactById = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete(contactId);

  return contact;
};
