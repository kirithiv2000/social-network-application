// import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';
import { expect,use,request } from 'chai';

use(chaiHttp);

let token;
let userId;

before(async () => {


  const user = new User({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123' });
  await user.save();
  userId = user._id;

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'johndoe@example.com', password: 'password123' });

  token = res.body.token;
});

after(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('User routes', () => {
  it('should get user information', (done) => {
    request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('username', 'johndoe');
        expect(res.body).to.have.property('email', 'johndoe@example.com');
        done();
      });
  });

  it('should add a friend', (done) => {
    const friendId = mongoose.Types.ObjectId(); // Replace with a valid ObjectId
    request(app)
      .post(`/api/users/add-friend/${friendId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'friend added successfully');
        done();
      });
  });
});
