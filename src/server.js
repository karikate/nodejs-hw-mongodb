import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';
import { getContactById, getContacts } from './db/services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { ENV_VARS } from './constants/env.js';

dotenv.config();
const PORT = Number(getEnvVar(ENV_VARS.PORT)) || 3000;

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    res.json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
