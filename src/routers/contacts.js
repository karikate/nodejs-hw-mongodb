import { Router } from 'express';
import { getContactById, getContacts } from '../db/services/contacts.js';

const router = Router();

router.get('/contacts', async (req, res) => {
  const contacts = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

router.get('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

export default router;
