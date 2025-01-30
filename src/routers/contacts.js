import { Router } from 'express';
import {
  deleteContController,
  getContByIdController,
  getContController,
  patchContController,
  postContController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContController));

router.get('/contacts/:contactId', ctrlWrapper(getContByIdController));
router.post('/contacts', ctrlWrapper(postContController));

router.patch('/contacts/:contactId', ctrlWrapper(patchContController));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContController));

export default router;
