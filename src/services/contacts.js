import { ContactsCollection } from '../db/models/contact.js';
import { notFoundContactHandler } from '../middlewares/notFoundContact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const filtersQuery = ContactsCollection.find();

  if (filter.type) {
    filtersQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite || filter.isFavourite === false) {
    filtersQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
    .merge(filtersQuery)
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .merge(filtersQuery)
    .limit(limit)
    .skip(skip)
    .sort({ [sortBy]: sortOrder });
  const paginData = calculatePaginationData(page, perPage, contactsCount);
  return {
    data: contacts,
    ...paginData,
  };
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
    notFoundContactHandler();
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
