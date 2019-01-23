import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../../app';

chai.use(chaiHttp);
chai.should();

describe('POST /signup', () => {
  it('should return 201 and request, when properties are valid', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Owa',
        email: 'tosin@gmail.com',
        password: '34567911',
      })
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('User sign up successful');
        res.body.should.have.property('code').eql(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('firstname');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('admin');
        res.body.data.should.have.property('email');
        done();
      });
  });

  it('should return 400, when firstname is invalid or null', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        lastname: 'Tosin',
        email: 'tosin@gmail.com',
        password: '34567',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('firstname is required or invalid');
        done();
      });
  });

  it('should return 400, when lastname is invalid or null', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        email: 'tosin@gmail.com',
        password: '34567',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('lastname is required or invalid');
        done();
      });
  });

  it('should return 400, when email is invalid or null', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Juliet',
        password: '34567',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('email is required or invalid');
        done();
      });
  });

  it('should return 400, when password is invalid or null', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Juliet',
        email: 'tosin@gmail.com',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('password is required or invalid');
        done();
      });
  });

  it('should return 422, when firstname is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: '   ',
        lastname: 'Tosin',
        email: 'tosin@gmail.com',
        password: '34567',
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

  it('should return 422, when lastname is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: '   ',
        email: 'tosin@gmail.com',
        password: '34567',
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

  it('should return 422, when email is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Juliet',
        email: '   ',
        password: '34567',
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

  it('should return 400, when password is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Juliet',
        email: 'tosin@gmail.com',
        password: '   ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('password is required or invalid');
        done();
      });
  });

  it('should return 409, when email already exists', done => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Tosin',
        lastname: 'Juliet',
        email: 'emecus10@gmail.com',
        password: '34567911',
      })
      .end((req, res) => {
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('code').eql(409);
        res.body.should.have.property('message').eql('User with email exists');
        done();
      });
  });
});
