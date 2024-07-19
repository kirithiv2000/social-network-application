// import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';
import { expect,use,request } from 'chai';

use(chaiHttp);

before(async () => {
  await mongoose.connect('mongodb://localhost:27017/socialnetwork_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth routes', () => {
  it('should register a new user', (done) => {
    request(app)
      .post('/api/auth/register')
      .send({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'User registered successfully');
        done();
      });
  });

  it('should log in a user', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'johndoe@example.com', password: 'password123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});
