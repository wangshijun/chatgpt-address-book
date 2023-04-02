const http = require('http');
const express = require('express');
const Datastore = require('nedb');
const Joi = require('joi');

const app = express();
const db = new Datastore({ filename: 'contacts.db', autoload: true });

// Middleware
app.use(express.json());

// Joi validation schemas
const contactSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
  db.find({}, (err, contacts) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(contacts);
    }
  });
});

// Create a new contact
app.post('/api/contacts', async (req, res) => {
  try {
    const result = await contactSchema.validateAsync(req.body);

    // Check if a contact with the same phone number already exists
    db.findOne({ phone: result.phone }, (err, contact) => {
      if (err) {
        res.status(500).json({ message: 'An error occurred while searching for the contact.' });
        return;
      }

      // If a contact with the same phone number is found, return an error
      if (contact) {
        res.status(409).json({ message: 'A contact with this phone number already exists.' });
        return;
      }

      // If no contact is found with the same phone number, insert the new contact
      db.insert(result, (err, newContact) => {
        if (err) {
          res.status(500).json({ message: 'An error occurred while creating the contact.' });
        } else {
          res.json(newContact);
        }
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing contact
app.put('/api/contacts/:id', (req, res) => {
  const { error, value } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    db.update({ _id: req.params.id }, value, {}, (err, numReplaced) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.sendStatus(200);
      }
    });
  }
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
  db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = http.createServer({ maxHeaderSize: 8192 }, app);
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
