const request = require('supertest');
const app = require('../app'); // assuming you have an express app
const Ebook = require('../models/Ebook');
const mongoose = require('mongoose');
const { setupDatabase, adminToken } = require('./fixtures/db'); // Setup test database

beforeEach(setupDatabase);

describe('DELETE /ebooks/:id', () => {
  let ebookId;

  beforeEach(async () => {
    const ebook = await Ebook.create({
      name: 'Test Ebook',
      content: 'Sample content',
      authors: ['Author 1'],
      section: mongoose.Types.ObjectId() // Assuming section ID is valid
    });
    ebookId = ebook._id;
  });

  test('should delete a book as an admin and ensure it is removed from the database', async () => {
    // Make the delete request
    await request(app)
      .delete(`/ebooks/${ebookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verify that the book is removed from the database
    const ebook = await Ebook.findById(ebookId);
    expect(ebook).toBeNull();
  });

  test('should return 404 if the ebook does not exist', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    await request(app)
      .delete(`/ebooks/${nonExistentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  test('should not allow deletion if the ebook is issued to a user', async () => {
    const ebook = await Ebook.findById(ebookId);
    ebook.issuedTo = mongoose.Types.ObjectId(); // Assigning a fake user
    await ebook.save();

    await request(app)
      .delete(`/ebooks/${ebookId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400); // Expecting 400 because the book is issued
  });
});
