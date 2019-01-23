import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import { server } from '../../../app';
import { generateToken } from '../../helpers/jwtHelper';

dotenv.config();
chai.use(chaiHttp);
chai.should();
let superUserToken =
  'jnjsds9sjsds9dskmsd9sdmdsjdsdsk.dsdsos0sld9sdosdsmsdmssdjsnsdjisdjksd';

describe('DELETE /users/requests/requestId', () => {
  before(() => {
    superUserToken = generateToken(
      { email: 'emecus10@gmail.com', id: 1, admin: true },
      '72h',
    );
  });

  it('should return 200, when token is valid and request was deleted', done => {
    chai
      .request(server)
      .delete('/api/v1/users/requests/1')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have
          .property('message')
          .eql('Request deleted successfully');
        res.body.should.have.property('code').eql(200);
        done();
      });
  });

  it('should return 401 when token is invalid', done => {
    chai
      .request(server)
      .delete('/api/v1/users/requests/0')
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

  it('should return 404 when request does not exist', done => {
    chai
      .request(server)
      .delete('/api/v1/users/requests/20')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(404);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('message').eql('Request does not exist');
        done();
      });
  });

  it('should return 400 when request can not be deleted', done => {
    chai
      .request(server)
      .delete('/api/v1/users/requests/2')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have
          .property('message')
          .eql(
            'Request can not be deleted, you can not delete an approved request',
          );
        done();
      });
  });

  it('should return 400, when requestId parameter is not valid', done => {
    chai
      .request(server)
      .delete('/api/v1/users/requests/hs')
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
