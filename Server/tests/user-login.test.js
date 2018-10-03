import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { server } from '../../app';

chai.use(chaiHttp);
chai.should();
dotenv.config();

describe('POST /login', () => {
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
        done();
      });
  });

  it('should return 400, when password is invalid or null', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'tosin@gmail.com',
        password: '3%b8!',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('password is required or invalid');
        done();
      });
  });

  it('should return 400, when password is an empty string', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'tosin@gmail.com',
        password: '    ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('password is required or invalid');
        done();
      });
  });

  it('should return 400, when email is null', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        password: '354363',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('email is required or invalid');
        done();
      });
  });

  it('should return 400, when password is null', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'chuksw@gmail.com',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('password is required or invalid');
        done();
      });
  });

  it('should return 401, user does not exist', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'bright@gmail.com',
        password: '34567',
      })
      .end((req, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(401);
        res.body.should.have.property('message').eql('User login failed, email does not exist');
        done();
      });
  });

  it('should return 401, when password is in correct', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'emecus10@gmail.com',
        password: '34567',
      })
      .end((req, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(401);
        res.body.should.have.property('message').eql('User login failed, incorrect password');
        done();
      });
  });
});
