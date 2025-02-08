import { CONT_BY } from '../constants/contact.js';
import { SORT_ORDER } from '../constants/sort.js';

export const parseSortParams = (query) => {
  const sortOrder = Object.values(SORT_ORDER).includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';
  const sortBy = Object.values(CONT_BY).includes(query.sortBy)
    ? query.sortBy
    : '_id';

  return {
    sortOrder,
    sortBy,
  };
};
