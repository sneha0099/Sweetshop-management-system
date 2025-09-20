import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Sweet from '../models/sweet.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI as string);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// this test checks if the GET /api/sweets endpoint supports search, filter, sort, and pagination
describe('GET /api/sweets with search, filter, sort and pagination', () => {
  beforeEach(async () => {
    await Sweet.insertMany([
      { name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 10 },
      { name: 'Gulab Jamun', category: 'Milk-Based', price: 30, quantity: 15 },
      { name: 'Ladoo', category: 'Nut-Based', price: 40, quantity: 5 },
      { name: 'Barfi', category: 'Milk-Based', price: 60, quantity: 8 },
    ]);
  });

  afterEach(async () => {
    await Sweet.deleteMany();
  });

  // this test checks if the GET /api/sweets endpoint returns all sweets
  it('should return sweets filtered by category, sorted by price descending', async () => {
    const res = await request(app).get(
      '/api/sweets?category=Milk-Based&sortBy=price&order=desc'
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.sweets)).toBe(true);
    expect(res.body.sweets.length).toBe(2);

    expect(res.body.sweets[0].price).toBeGreaterThanOrEqual(res.body.sweets[1].price);

    res.body.sweets.forEach((sweet: any) => {
      expect(sweet.category).toBe('Milk-Based');
    });
  });

  //filter by name of the sweet having 'ka' in it
  it('should return sweets with name containing "ka"', async () => {
    const res = await request(app).get('/api/sweets?name=ka');

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBeGreaterThan(0);
    const names = res.body.sweets.map((s: any) => s.name.toLowerCase());
    names.forEach((n: string) => expect(n.includes('ka')).toBe(true));
  });

  it('should apply pagination and return limited sweets', async () => {
    const res = await request(app).get('/api/sweets?page=1&limit=2');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.sweets)).toBe(true);
    expect(res.body.sweets.length).toBeLessThanOrEqual(2);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('totalPages');
  });
});
