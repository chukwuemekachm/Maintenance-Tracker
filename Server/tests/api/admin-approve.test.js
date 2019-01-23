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
let superUserToken =
  'jnjsds9sjsds9dskmsd9sdmdsjdsdsk.dsdsos0sld9sdosdsmsdmssdjsnsdjisdjksd';

describe('PUT /requests/:requestId/approve', () => {
  before(() => {
    superUserToken = generateToken(
      { email: 'emecus10@gmail.com', id: 1, admin: true },
      '72h',
    );
    userToken = generateToken(
      { email: 'brighto@gmail.com', id: 2, admin: false },
      '72h',
    );
  });

  it('should return 200 and request, when token is valid and request was approved', done => {
    chai
      .request(server)
      .put('/api/v1/requests/1/approve')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have
          .property('message')
          .eql('Request approved successfully');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('title');
        res.body.data.should.have.property('description');
        res.body.data.should.have.property('updatedat');
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('should return 400 and requests, when token but request is not pending', done => {
    chai
      .request(server)
      .put('/api/v1/requests/2/approve')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have
          .property('message')
          .eql('Request can no longer be approved or disapproved');
        res.body.should.have.property('code').eql(400);
        done();
      });
  });

  it('should return 401 when token is invalid', done => {
    chai
      .request(server)
      .put('/api/v1/requests/1/approve')
      .set(
        'Authorization',
        'Bearer ndfkjvksdkvdjsfesfndvi.uhbvwefiuweihiew.bnrejdfjufdj',
      )
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(401);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have
          .property('message')
          .eql('Invalid authorization token');
        done();
      });
  });

  it('should return 403 when token is valid but user is not an admin', done => {
    chai
      .request(server)
      .put('/api/v1/requests/1/approve')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(403);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have
          .property('message')
          .eql('You dont have access to this resource');
        done();
      });
  });

  it('should return 404 request does not exist in the system', done => {
    chai
      .request(server)
      .put('/api/v1/requests/5/approve')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(404);
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('message').eql('Request does not exist');
        done();
      });
  });

  it('should return 400, when requestId parameter is not valid', done => {
    chai
      .request(server)
      .put('/api/v1/requests/hs/approve')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(400);
        res.should.be.a('object');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('message').eql('requestId is not valid');
        done();
      });
  });
});
