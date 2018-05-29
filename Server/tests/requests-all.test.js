import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
const should = chai.should();

describe('GET /', () => {
  it('should return 200 and requests,', (done) => {
    chai.request(server)
      .get('/api/v1/users/requests')
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('message').eql('Requests found for the user');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.requests.should.be.an('array');
        res.body.data.requests[0].should.have.property('id');
        res.body.data.requests[0].should.have.property('title');
        res.body.data.requests[0].should.have.property('type');
        res.body.data.requests[0].should.have.property('description');
        res.body.data.requests[0].should.have.property('createdAt');
        res.body.data.requests[0].should.have.property('updatedAt');
        done();
      });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api/v1/users/').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('message').eql('Route not supported on server.');
      done();
    });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api/v1/users/ok').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('message').eql('Route not supported on server.');
      done();
    });
  });
});
