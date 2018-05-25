import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import { server } from '../../app';

dotenv.config();
chai.use(chaiHttp);
chai.should();
let userToken = '';
let superUserToken = 'jnjsds9sjsds9dskmsd9sdmdsjdsdsk.dsdsos0sld9sdosdsmsdmssdjsnsdjisdjksd';

describe('PUT /requests/:requestId/approve', () => {
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

  it('should return 200 and token, when credentials are valid', (done) => {
    chai.request(server).post('/api/v1/auth/login')
      .send({
        email: 'brighto@gmail.com',
        password: `${process.env.USER_PASSWORD}`,
      })
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('User login successful');
        res.body.should.have.property('code').eql(200);
        userToken = res.body.token;
        done();
      });
  });

  it('should return 200 and requests, when token is valid and requests exists', (done) => {
    chai.request(server)
      .put('/api/v1/requests/1/resolve')
      .set('Authorization', `Bearer ${superUserToken}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Request resolved successfully');
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

  it('should return 401 when token is invalid', (done) => {
    chai.request(server)
      .put('/api/v1/requests/1/resolve')
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

  it('should return 403 when token is valid but user is not an admin', (done) => {
    chai.request(server)
      .put('/api/v1/requests/1/resolve')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('code').eql(403);
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('message').eql('You dont have access to this resource');
        done();
      });
  });


  it('should return 404 request does not exist in the system', (done) => {
    chai.request(server)
      .put('/api/v1/requests/3/resolve')
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

  it('should return 400, when requestId parameter is not valid', (done) => {
    chai.request(server).put('/api/v1/requests/hs/resolve')
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

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api/requests/hd/ijk').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route not supported on server.');
      done();
    });
  });
});
