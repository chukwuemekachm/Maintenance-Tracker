import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { server } from '../../../app';

chai.use(chaiHttp);
chai.should();
dotenv.config();
let token;

describe('GET /account', () => {
  it('should return 200 and request, when properties are valid', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'emecus10@gmail.com',
        password: `${process.env.JWT_KEY}`,
      })
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('User login successful');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('token');
        ({ token } = res.body);
        done();
      });
  });

  it('should return 401, when access token is invalid', (done) => {
    chai.request(server).get('/api/v1/auth/account')
      .set('Authorization', 'Bearer badToken623bewq842j3kr')
      .end((req, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('code').eql(401);
        res.body.should.have.property('message').eql('Invalid authorization token');
        done();
      });
  });

  it('should return 200, when access token is valid', (done) => {
    chai.request(server).get('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('code').eql(200);
        res.body.data.should.have.property('firstname');
        res.body.should.have.property('data');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('admin');
        res.body.data.should.have.property('createdat');
        res.body.data.should.have.property('updatedat');
        res.body.should.have.property('message').eql('User details retrieved successfully');
        done();
      });
  });
});
