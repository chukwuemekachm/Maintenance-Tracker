import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import { server } from '../../../app';
import { generateToken } from '../../helpers/jwtHelper';

chai.use(chaiHttp);
chai.should();
dotenv.config();
let token;

describe('POST /login', () => {
  before(() => {
    token = generateToken(
      { email: 'brighto@gmail.com', id: 2, admin: false },
      '72h',
    );
  });

  it('should return 401, when access token is invalid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/account')
      .set('Authorization', 'Bearer badToken623bewq842j3kr')
      .end((req, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('code').eql(401);
        res.body.should.have
          .property('message')
          .eql('Invalid authorization token');
        done();
      });
  });

  it('should return 400, when access token is valid firstname is not valid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: '',
        lastname: 'John',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 400, when access token is valid lastname is not valid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Bright',
        lastname: '',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 200, payload is valid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Paul',
        lastname: 'John',
      })
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('createdat');
        res.body.data.should.have.property('updatedat');
        res.body.should.have
          .property('message')
          .eql('User profile updated successfully');
        done();
      });
  });
});
