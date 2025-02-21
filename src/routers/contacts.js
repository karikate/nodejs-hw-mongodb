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
import {
  validateSchemaCreate,
  validateSchemaUpdate,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticateUser } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticateUser);

router.get('/', ctrlWrapper(getContController));
router.get('/:contactId', isValidId, ctrlWrapper(getContByIdController));
router.post(
  '/',
  validateBody(validateSchemaCreate),
  ctrlWrapper(postContController),
);
router.patch(
  '/:contactId',
  validateBody(validateSchemaUpdate),
  isValidId,
  ctrlWrapper(patchContController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContController));

export default router;
