import { ContactsCollection } from '../db/models/contact.js';
import { notFoundContactHandler } from '../middlewares/notFoundContact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

  const paginData = calculatePaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginData,
  };
};
export const postContact = async (dataContact, userId) => {
  let photoUrl;
  if (dataContact.photo) {
    photoUrl = await saveFileToCloudinary(dataContact.photo);
  }

  const contact = await ContactsCollection.create({
    ...dataContact,
    photo: photoUrl ? photoUrl : undefined,
    userId,
  });

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
  let photoUrl;
  if (payload.photo) {
    photoUrl = await saveFileToCloudinary(payload.photo);
  }

  const response = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: userId },
    { ...payload, photo: photoUrl ? photoUrl : undefined },
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
