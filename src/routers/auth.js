import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  validateSchemaLogin,
  validateSchemaRegister,
} from '../validation/users.js';

const router = Router();

router.post(
  '/register',
  validateBody(validateSchemaRegister),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  validateBody(validateSchemaLogin),
  ctrlWrapper(loginUserController),
);
router.post('/refresh', ctrlWrapper(refreshSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
