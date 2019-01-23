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

describe('GET /users/requests/requestId', () => {
  before(() => {
    superUserToken = generateToken(
      { email: 'emecus10@gmail.com', id: 1, admin: false },
      '72h',
    );
    userToken = generateToken(
      { email: 'brighto@gmail.com', id: 2, admin: false },
      '72h',
    );
  });

  it('should return 200 and requests, when token is valid and requests exists', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests/4')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have
          .property('message')
          .eql('Request retrieved successfully');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('title');
        res.body.data[0].should.have.property('description');
        res.body.data[0].should.have.property('user_id');
        res.body.data[0].should.have.property('createdat');
        res.body.data[0].should.have.property('updatedat');
        res.body.data[0].should.be.an('object');
        done();
      });
  });

  it('should return 401 when token is invalid', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests/0')
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

  it('should return 404 when no request exist for the user', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests/0')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(404);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have
          .property('message')
          .eql('Request does not exist for the user');
        done();
      });
  });

  it('should return 400, when requestId parameter is not valid', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests/hs')
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
