import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sweet from '../models/sweet.model';
import { User } from '../models/user.model';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

let userToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
  
  // Create a regular user for testing (both admin and user roles can view sweets)
  const testUser = new User({
    firstname: 'Test',
    lastname: 'User',
    email: 'user@test.com',
    password: 'testpassword123',
    role: 'user',
    verified: true
  });
  
  await testUser.save();
  
  // Generate token for the user
  userToken = testUser.generateToken();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/sweets', () => {
  beforeEach(async () => {
    // Seed database with test data
    await Sweet.create([
      { name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 10 },
      { name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 15 },
    ]);
  });

  afterEach(async () => {
    await Sweet.deleteMany(); // Clean up after each test
  });

  it('should return a list of all sweets with status 200', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.sweets)).toBe(true);
    expect(res.body.sweets.length).toBeGreaterThanOrEqual(2);

    const sweetNames = res.body.sweets.map((s: any) => s.name);

    expect(sweetNames).toContain('Kaju Katli');
    expect(sweetNames).toContain('Gulab Jamun');
  });

  it('should return 401 if no authentication token provided', async () => {
    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Access denied. No token provided.');
  });
});
