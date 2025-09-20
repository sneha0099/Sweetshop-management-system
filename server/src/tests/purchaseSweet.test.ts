import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from '../models/sweet.model';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let sweetId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// this test checks if the POST /api/sweets/purchase/:id endpoint allows purchasing a sweet
// it checks if the sweet exists, if there is enough stock, and updates the quantity accordingly
describe('POST /api/sweets/purchase/:id', () => {
  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Rasgulla',
      category: 'Milk-Based',
      price: 20,
      quantity: 10,
    });
    sweetId = sweet._id.toString();
  });

  afterEach(async () => {
    await Sweet.deleteMany();
  });

  it('should purchase sweet and reduce quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/purchase/${sweetId}`)
      .send({ quantity: 2 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sweet purchased successfully');
    expect(res.body.sweet.quantity).toBe(8);
  });

  it('should return error if sweet not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .post(`/api/sweets/purchase/${fakeId}`)
      .send({ quantity: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Sweet not found');
  });

  it('should return error if not enough stock', async () => {
    const res = await request(app)
      .post(`/api/sweets/purchase/${sweetId}`)
      .send({ quantity: 20 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Not enough stock');
  });

  it('should return error for invalid quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/purchase/${sweetId}`)
      .send({ quantity: -3 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid quantity');
  });
});
