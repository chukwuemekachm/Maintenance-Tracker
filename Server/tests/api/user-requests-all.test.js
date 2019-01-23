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

describe('GET /users/requests', () => {
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

  it('should return 200 and requests, when token is valid and requests exists', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have
          .property('message')
          .eql('Requests retrieved successfully');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        done();
      });
  });

  it('should return 401 when token is invalid', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests')
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

  it('should return 200 when no request exist for the user', done => {
    chai
      .request(server)
      .get('/api/v1/users/requests')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('status').eql('success');
        done();
      });
  });
});
