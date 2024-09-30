const request = require('supertest');
const app = require('../app'); // Import your Express app
const mongoose = require('mongoose');
const { Ebook } = require('../models/Ebook');

describe('Ebook Integration Tests', () => {
    let token;

    // Sample librarian user for authentication
    const librarianUser = {
        username: 'librarian@example.com',
        password: 'password123',
    };

    // Before all tests, connect to the database and authenticate
    beforeAll(async () => {
        // Connect to your MongoDB
        await mongoose.connect('mongodb://localhost:27017/your-database', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Log in as a librarian to get the auth token
        const response = await request(app)
            .post('/api/auth/login')
            .send(librarianUser);

        token = response.body.token; // Assuming the token is returned in the response body
    });

    // Clean up the database before each test
    beforeEach(async () => {
        await Ebook.deleteMany({});
    });

    // Test for adding a new e-book
    it('should add a new ebook and verify it is displayed in the database', async () => {
        const newEbook = {
            name: 'Test Ebook',
            content: 'This is a test ebook content.',
            authors: ['Author 1', 'Author 2'],
            section: 'sectionId', // Replace with an actual section ID if needed
        };

        // Send request to add a new ebook
        const addEbookResponse = await request(app)
            .post('/api/ebooks')
            .set('Authorization', `Bearer ${token}`)
            .send(newEbook);

        // Assert the response status and structure
        expect(addEbookResponse.status).toBe(200);
        expect(addEbookResponse.body).toHaveProperty('_id');

        // Fetch the ebook from the database
        const ebookInDb = await Ebook.findById(addEbookResponse.body._id);

        // Assert the ebook is correctly saved in the database
        expect(ebookInDb).toBeTruthy();
        expect(ebookInDb.name).toBe(newEbook.name);
        expect(ebookInDb.content).toBe(newEbook.content);
        expect(ebookInDb.authors).toEqual(newEbook.authors);

        // Optionally, you can verify the ebook is displayed on the available books page
        const availableBooksResponse = await request(app)
            .get('/api/ebooks') // Assuming this route returns the available ebooks
            .set('Authorization', `Bearer ${token}`);

        expect(availableBooksResponse.status).toBe(200);
        expect(availableBooksResponse.body).toContainEqual(
            expect.objectContaining({ name: newEbook.name })
        );
    });

    // After all tests, disconnect from the database
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
