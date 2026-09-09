const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const User = require('../models/users');
const Movie = require('../models/movie');

let mongo;

const moviePayload = {
  country: 'USA',
  director: 'Lana Wachowski',
  duration: 136,
  year: '1999',
  description: 'A computer hacker learns the truth.',
  image: 'https://example.com/image.jpg',
  trailerLink: 'https://example.com/trailer',
  thumbnail: 'https://example.com/thumb.jpg',
  nameRU: 'Матрица',
  nameEN: 'The Matrix',
  movieId: 42,
};

async function createUser(overrides = {}) {
  const payload = {
    name: 'Елена',
    email: 'elena@mail.ru',
    password: 'password123',
    ...overrides,
  };
  const response = await request(app).post('/signup').send(payload);
  return { payload, response };
}

async function loginUser(email, password) {
  const response = await request(app).post('/signin').send({ email, password });
  return response;
}

describe('movies-explorer-api', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    await Movie.syncIndexes();
    await User.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Movie.deleteMany({});
  });

  it('GET /health возвращает ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('POST /signup отклоняет запрос без имени', async () => {
    const response = await request(app).post('/signup').send({
      email: 'user@mail.ru',
      password: 'password123',
    });
    expect(response.status).toBe(400);
  });

  it('POST /signup отклоняет короткий пароль', async () => {
    const response = await request(app).post('/signup').send({
      name: 'Елена',
      email: 'user@mail.ru',
      password: '123456',
    });
    expect(response.status).toBe(400);
  });

  it('POST /signup создаёт пользователя', async () => {
    const { response } = await createUser();
    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({
      name: 'Елена',
      email: 'elena@mail.ru',
    });
    expect(response.body.user.password).toBeUndefined();
  });

  it('POST /signup возвращает 409 при повторном email', async () => {
    await createUser();
    const { response } = await createUser();
    expect(response.status).toBe(409);
  });

  it('POST /signin возвращает jwt и данные пользователя', async () => {
    await createUser();
    const response = await loginUser('elena@mail.ru', 'password123');

    expect(response.status).toBe(200);
    expect(response.body.jwt).toEqual(expect.any(String));
    expect(response.body.name).toBe('Елена');
    expect(response.body.email).toBe('elena@mail.ru');
    expect(response.body._id).toBeDefined();
  });

  it('POST /signin возвращает 401 при неверном пароле', async () => {
    await createUser();
    const response = await loginUser('elena@mail.ru', 'wrongpass');
    expect(response.status).toBe(401);
  });

  it('GET /users/me без токена возвращает 401', async () => {
    const response = await request(app).get('/users/me');
    expect(response.status).toBe(401);
  });

  it('GET /users/me возвращает текущего пользователя', async () => {
    await createUser();
    const { body } = await loginUser('elena@mail.ru', 'password123');

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${body.jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Елена',
      email: 'elena@mail.ru',
    });
  });

  it('PATCH /users/me возвращает 409 при занятом email', async () => {
    await createUser();
    await createUser({ name: 'Мария', email: 'maria@mail.ru' });
    const { body } = await loginUser('elena@mail.ru', 'password123');

    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${body.jwt}`)
      .send({ name: 'Елена', email: 'maria@mail.ru' });

    expect(response.status).toBe(409);
  });

  it('сохраняет фильм и не даёт сохранить его повторно', async () => {
    await createUser();
    const { body } = await loginUser('elena@mail.ru', 'password123');
    const auth = { Authorization: `Bearer ${body.jwt}` };

    const created = await request(app)
      .post('/movies')
      .set(auth)
      .send(moviePayload);

    expect(created.status).toBe(201);
    expect(created.body.movieId).toBe(42);
    expect(created.body.id).toBeUndefined();

    const duplicate = await request(app)
      .post('/movies')
      .set(auth)
      .send(moviePayload);

    expect(duplicate.status).toBe(409);

    const list = await request(app).get('/movies').set(auth);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('DELETE /movies/:_id возвращает 403 для чужого фильма', async () => {
    await createUser();
    const firstLogin = await loginUser('elena@mail.ru', 'password123');
    const created = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${firstLogin.body.jwt}`)
      .send(moviePayload);

    await createUser({ name: 'Мария', email: 'maria@mail.ru' });
    const secondLogin = await loginUser('maria@mail.ru', 'password123');

    const response = await request(app)
      .delete(`/movies/${created.body._id}`)
      .set('Authorization', `Bearer ${secondLogin.body.jwt}`);

    expect(response.status).toBe(403);
  });

  it('неизвестный маршрут возвращает 404', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });
});
