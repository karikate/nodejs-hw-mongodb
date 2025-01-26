import { Router } from 'express';
import {
  getContByIdController,
  getContController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContController));

router.get('/contacts/:contactId', ctrlWrapper(getContByIdController));

export default router;
