const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Section = require('../models/Section'); // assuming you have a Section model
const User = require('../models/User');
const sectionRoutes = require('../routes/sectionRoutes'); // the file that contains your routes
const app = express();

// Setup mock app and middleware
app.use(express.json());
app.use('/api/sections', sectionRoutes);

jest.mock('../models/Section');
jest.mock('../models/User');

describe('Integration Test - Add New Section', () => {
  let token;

  beforeAll(() => {
    // Simulating a token for authentication
    token = 'mocked-token'; // Replace this with actual JWT token logic if needed
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a new section and display it in the section list', async () => {
    // Mock data for section
    const newSection = {
      name: 'New Section',
      description: 'This is a new section',
    };

    // Mock data for what will be returned by the Section model
    const mockSection = {
      _id: 'fakeSectionId',
      name: newSection.name,
      description: newSection.description,
    };

    // Mocking Section creation
    Section.create.mockResolvedValue(mockSection);

    // First, simulate adding a new section
    const addResponse = await request(app)
      .post('/api/sections')
      .set('Authorization', `Bearer ${token}`)
      .send(newSection)
      .expect(200);

    // Assert the response to ensure section was added successfully
    expect(addResponse.body).toMatchObject({
      _id: expect.any(String),
      name: newSection.name,
      description: newSection.description,
    });

    // Mocking a database response for section retrieval
    const mockSectionList = [
      mockSection, // newly added section
      { _id: 'existingSectionId', name: 'Existing Section', description: 'An existing section' },
    ];

    // Mock Section find method to return sections
    Section.find.mockResolvedValue(mockSectionList);

    // Then, simulate fetching the updated list of sections
    const getResponse = await request(app)
      .get('/api/sections')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Assert the response to ensure it contains the newly added section
    expect(getResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: mockSection._id,
          name: mockSection.name,
          description: mockSection.description,
        }),
      ])
    );
  });
});
