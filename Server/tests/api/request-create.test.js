import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import { server } from '../../../app';
import { generateToken } from '../../helpers/jwtHelper';

dotenv.config();
chai.use(chaiHttp);
chai.should();
let userToken = '';

describe('POST /requests', () => {
  before(() => {
    userToken = generateToken(
      { email: 'emecus10@gmail.com', id: 2, admin: false },
      '72h',
    );
  });

  it('should return 201 and request, when properties are valid', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Bad Printer keb',
        type: 'repair',
        description: 'My Printer Heater has stopped working',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have
          .property('message')
          .eql('Request created successfully');
        res.body.should.have.property('code').eql(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('title');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('description');
        res.body.data.should.have.property('type');
        res.body.data.should.have.property('status');
        done();
      });
  });

  it('should return 409 and request, when properties are duplicate', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Bad Printer keb',
        type: 'repair',
        description: 'My Printer Heater has stopped working',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(409);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have
          .property('message')
          .eql('Request already exists for user, "No Duplicates"');
        res.body.should.have.property('code').eql(409);
        done();
      });
  });

  it('should return 400, when title is invalid', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: '3[]=',
        type: 'repair',
        description: 'Water dispense does not dispense cold water',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('title is required or invalid');
        done();
      });
  });

  it('should return 400, when type is invalid or not repair/maintenance', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Faulty Water dispenser',
        type: 'rep392',
        description: 'Water dispense does not dispense cold water',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql(
            'type is required or invalid, it must be a "repair" or a "maintenance"',
          );
        done();
      });
  });

  it('should return 400, when description is null', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Faulty Water dispenser',
        type: 'repair',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have
          .property('message')
          .eql('description is required or invalid');
        done();
      });
  });

  it('should return 400, when title is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: '    ',
        type: 'rep392',
        description: 'Water dispense does not dispense cold water',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 400, when title is an empty string', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Faulty Water dispenser',
        type: '   ',
        description: 'Water dispense does not dispense cold water',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 401, when authentication fails', done => {
    chai
      .request(server)
      .post('/api/v1/users/requests')
      .send({
        title: 'Faulty Water dispenser',
        type: 'repair',
        description: 'Water dispense does not dispense cold water',
      })
      .set('Authorization', 'Bearer nuidfuwe8invkvjor.rviur9u95wvkilrgopi')
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
});
