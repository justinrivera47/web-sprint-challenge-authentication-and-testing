// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();

})

// beforeEach(async () => {
//   await db.seed.run();
// })

afterAll(async () => {
  await db.destroy()
})

describe('HTTP endpoints', () => {
    test(`GET / can't jokes without token`, async () => {
      let result = await request(server).get('/api/jokes')
      expect(result.status).toBe(401);
      expect(result.body).toBeDefined();
    })

    test('Post / sending password with empty string for username vs with correct username', async () => {
      let result = await request(server)
          .post('/api/auth/register')
          .send({ username: '    ', password: 'foobar'});

      expect(result.status).toBe(404);

          result = await request(server)
          .post('/api/auth/register')
          .send({ username: 'Captain Marvel', password: 'foobar'});

      expect(result.status).toBe(201);
      expect(result.body).toMatchObject({ 
        username: `Captain Marvel`
      });

      result = await db('users').where('username', 'Captain Marvel').first();
      expect(result).toBeDefined();
    });

    //make a test that expects the screen to render, "Welcome, ${username}"
})