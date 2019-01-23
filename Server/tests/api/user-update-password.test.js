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

describe('PUT /changepassword', () => {
  before(() => {
    token = generateToken(
      { email: 'soulx@gmail.com', id: 3, admin: false },
      '72h',
    );
  });

  it('should return 401, when access token is invalid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
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

  it('should return 400, when access token is valid but oldpassword is null', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newpassword: 'mypassword',
        confirmpassword: 'mypasword',
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

  it('should return 400, when access token is valid but newpassword is null', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: 'mypassword',
        confirmpassword: 'mypasword',
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

  it('should return 400, when access token is valid but confirmpassword is null', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: 'mypassword',
        newpassword: 'mypassword',
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

  it('should return 422, when access token is valid but newpassword is invalid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: 'mypassword',
        newpassword: '  ',
        confirmpassword: 'mypasword',
      })
      .end((req, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(422);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 422, when access token is valid but confirmpassword is invalid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: 'mypassword',
        newpassword: 'mypassword',
        confirmpassword: 'mypass',
      })
      .end((req, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(422);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 400, when access token is valid but oldpassword is incorrect', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: 'my23De4D6',
        newpassword: `${process.env.USER_PASSWORD_2}`,
        confirmpassword: `${process.env.USER_PASSWORD_2}`,
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('Password is incorrect');
        done();
      });
  });

  it('should return 200, when payload is valid', done => {
    chai
      .request(server)
      .put('/api/v1/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldpassword: `${process.env.USER_PASSWORD}`,
        newpassword: `${process.env.USER_PASSWORD_2}`,
        confirmpassword: `${process.env.USER_PASSWORD_2}`,
      })
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('code').eql(200);
        res.body.should.have
          .property('message')
          .eql('User password updated successfully');
        done();
      });
  });
});
