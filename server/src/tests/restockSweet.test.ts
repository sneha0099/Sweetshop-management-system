import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Sweet from '../models/sweet.model';
import { User } from '../models/user.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let sweetId: string;
let adminToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
  
  // Create an admin user for testing (only admin can restock)
  const adminUser = new User({
    firstname: 'Test',
    lastname: 'Admin',
    email: 'admin@test.com',
    password: 'testpassword123',
    role: 'admin',
    verified: true
  });
  
  await adminUser.save();
  
  // Generate token for the admin user
  adminToken = adminUser.generateToken();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// this test checks if the PATCH /api/sweets/:id/restock endpoint allows restocking a sweet
describe('PATCH /api/sweets/:id/restock', () => {
  beforeEach(async () => {
    const sweet = await Sweet.create({
      name: 'Ladoo',
      category: 'Nut-Based',
      price: 40,
      quantity: 10,
    });
    sweetId = sweet._id.toString();
  });

  afterEach(async () => {
    await Sweet.deleteMany();
  });

  it('should restock the sweet and return updated quantity', async () => {
    const res = await request(app)
      .patch(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 15 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('quantity', 25); // 10 + 15
  });

  it('should return 404 if sweet is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/sweets/${fakeId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sweet not found');
  });

  it('should return 400 for invalid quantity', async () => {
    const res = await request(app)
      .patch(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: -5 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 if no authentication token provided', async () => {
    const res = await request(app)
      .patch(`/api/sweets/${sweetId}/restock`)
      .send({ quantity: 10 });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Access denied. No token provided.');
  });
});
