// import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import {server} from '../index.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { expect,use } from 'chai';
import request from 'supertest';

use(chaiHttp);

let token;
let userId;

before(async () => {
  console.log("hello")
;

  // const user = new User({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123' });
  // await user.save();
  // userId = user._id;
  const res1 = await request(server)
  .post('/api/users/register')
  .send({ username: 'johndoe', email: 'johndoe@example.com', password: 'password123' });
  const res = await request(server)
    .post('/api/users/login')
    .send({ email: 'johndoe@example.com', password: 'password123' });
  token = res.body.token;
});

after(async () => {

  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});



describe('Post routes', () => {

  it('should create a new post', (done) => {
    console.log(token,"token")
    request(server)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'This is a test post' })
      .end((err, res) => {
        console.log(res,err)
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('content', 'This is a test post');
        done();
      });
  });

  it('should get all posts', (done) => {
    request(server)
      .get('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
