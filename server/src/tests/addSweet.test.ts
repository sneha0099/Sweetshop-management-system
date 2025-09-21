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

// this test checks if the POST /api/sweets endpoint returns a 201 status code
describe('Post /api/sweets', () => {
  it('should return sweet status 201', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'kaju katli',
        category: 'Nut-Based',
        price: 50,
        quantity: 20,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'kaju katli');
  });
});
