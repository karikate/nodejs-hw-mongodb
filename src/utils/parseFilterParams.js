import { CONT_BY } from '../constants/contact.js';

const parseType = (string) => {
  if (Object.values(CONT_BY.contactType).includes(string)) return string;
};

const parseIsFav = (string) => {
  if (Object.values(CONT_BY.isFavourite).includes(string))
    return JSON.parse(string);
};

export const parseFilterParams = (filter) => {
  return {
    type: parseType(filter.type),
    isFavourite: parseIsFav(filter.isFavourite),
  };
};
