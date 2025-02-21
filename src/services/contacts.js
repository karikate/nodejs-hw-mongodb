import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contact.js';
import { notFoundContactHandler } from '../middlewares/notFoundContact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const filtersQuery = ContactsCollection.find();
  const contactByUser = ContactsCollection.find({ userId: userId });

  if (filter.type) {
    filtersQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite || filter.isFavourite === false) {
    filtersQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
    .merge(filtersQuery)
    .merge(contactByUser)
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .merge(filtersQuery)
    .merge(contactByUser)
    .limit(limit)
    .skip(skip)
    .sort({ [sortBy]: sortOrder });

  if (!contacts || contacts.length === 0)
    throw new createHttpError(404, 'User`s contacts not found');

  const paginData = calculatePaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginData,
  };
};
export const postContact = async (dataContact, userId) => {
  const contact = await ContactsCollection.create({ ...dataContact, userId });

  return contact;
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });

  return contact;
};

export const patchContactById = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const response = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: userId },
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
    notFoundContactHandler();
  }

  return {
    contact,
    isNew,
  };
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return contact;
};
