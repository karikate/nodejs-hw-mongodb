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
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticateUser);

router.get('/', ctrlWrapper(getContController));
router.get('/:contactId', isValidId, ctrlWrapper(getContByIdController));
router.post(
  '/',
  upload.single('photo'),
  validateBody(validateSchemaCreate),
  ctrlWrapper(postContController),
);
router.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(validateSchemaUpdate),
  isValidId,
  ctrlWrapper(patchContController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContController));

export default router;
