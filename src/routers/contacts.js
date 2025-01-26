import { Router } from 'express';
import {
  getContByIdController,
  getContController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/contacts', getContController);

router.get('/contacts/:contactId', getContByIdController);

export default router;
