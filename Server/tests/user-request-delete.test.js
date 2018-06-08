import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { server } from '../../app';

dotenv.config();
chai.use(chaiHttp);
chai.should();
let superUserToken = 'jnjsds9sjsds9dskmsd9sdmdsjdsdsk.dsdsos0sld9sdosdsmsdmssdjsnsdjisdjksd';

describe('DELETE /users/requests/requestId', () => {
  it('should return 200 and token, when credentials are valid', (done) => {
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
        superUserToken = res.body.token;
        done();
      });
  });

  it('should return 200 and requests, when token is valid and request was deleted', (done) => {
    chai.request(server)
      .delete('/api/v1/users/requests/1')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Request deleted successfully');
        res.body.should.have.property('code').eql(200);
        done();
      });
  });

  it('should return 401 when token is invalid', (done) => {
    chai.request(server)
      .delete('/api/v1/users/requests/0')
      .set('Authorization', 'Bearer ndfkjvksdkvdjsfesfndvi.uhbvwefiuweihiew.bnrejdfjufdj')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(401);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('message').eql('Invalid authorization token');
        done();
      });
  });

  it('should return 404 when request does not exist', (done) => {
    chai.request(server)
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

  it('should return 400 when request can not be deleted', (done) => {
    chai.request(server)
      .delete('/api/v1/users/requests/2')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('message').eql('Request can not be deleted, you can not delete an approved request');
        done();
      });
  });

  it('should return 400, when requestId parameter is not valid', (done) => {
    chai.request(server)
      .delete('/api/v1/users/requests/hs').end((req, res) => {
        res.should.have.status(400);
        res.should.be.a('object');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('message').eql('requestId is not valid');
        done();
      });
  });
});
