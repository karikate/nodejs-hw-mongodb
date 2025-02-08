import { Router } from 'express';
import {
  deleteContController,
  getContByIdController,
  getContController,
  patchContController,
  postContController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContByIdController),
);
router.post(
  '/contacts',
  validateBody(validateSchema),
  ctrlWrapper(postContController),
);
router.patch(
  '/contacts/:contactId',
  validateBody(validateSchema),
  isValidId,
  ctrlWrapper(patchContController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContController),
);

export default router;
