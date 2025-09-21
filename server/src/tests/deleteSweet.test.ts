import request from 'supertest';
import app from '../app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { User } from '../models/user.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let adminToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
  
  // Create an admin user for testing
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

describe('DELETE /api/sweets/:id', () => {
  it('should delete a sweet by ID and return 200', async () => {
    // First, create a sweet
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Gulab Jamun',
        category: 'Milk-Based',
        price: 25,
        quantity: 10,
      });

    const sweetId = createRes.body._id;
    expect(createRes.statusCode).toBe(201);
    expect(sweetId).toBeDefined();

    // Now, delete the sweet
    const deleteRes = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty(
      'message',
      'Sweet deleted successfully'
    );
  });

  it('should return 404 if sweet not found', async () => {
    const fakeId = '64f000000000000000000000'; // valid ObjectId format, non-existent
    const res = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Sweet not found');
  });
});

