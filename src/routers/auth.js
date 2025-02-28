import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetPasswordController,
  sendResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  validateSchemaLogin,
  validateSchemaRegister,
} from '../validation/users.js';
import {
  validateSchemaResetPsw,
  validateSchemaSendResetEmail,
} from '../validation/auth.js';

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

router.post(
  '/send-reset-email',
  validateBody(validateSchemaSendResetEmail),
  ctrlWrapper(sendResetEmailController),
);
router.post(
  '/reset-pwd',
  validateBody(validateSchemaResetPsw),
  ctrlWrapper(resetPasswordController),
);
export default router;
