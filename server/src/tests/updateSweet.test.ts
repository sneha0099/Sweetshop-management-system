import request from 'supertest';
import app from '../app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// this test checks if the PATCH /api/sweets/:id endpoint returns a 200 status code
describe('PATCH /api/sweets/:id', () => {
  it('should update a sweet by ID and return 200', async () => {
    // First, create a sweet
    const createRes = await request(app).post('/api/sweets').send({
      name: 'Gulab Jamun',
      category: 'Milk-Based',
      price: 25,
      quantity: 10,
    });

    const sweetId = createRes.body._id;
    expect(createRes.statusCode).toBe(201);
    expect(sweetId).toBeDefined();

    // Now, update the sweet
    const updateRes = await request(app).patch(`/api/sweets/${sweetId}`).send({
      name: 'Gulab Jamun',
      category: 'Milk-Based',
      price: 25,
      quantity: 10,
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('name', 'Gulab Jamun');
  });

  it('should return 404 if sweet not found', async () => {
    const fakeId = '64'; // valid format, non-existent
    const res = await request(app).patch(`/api/sweets/${fakeId}`).send({
      name: 'Gulab Jamun',
      category: 'Milk-Based',
      price: 25,
      quantity: 10,
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Sweet not found');
  });
});