import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
const should = chai.should();

describe('GET /', () => {
  it('should return 200 and request,', (done) => {
    chai.request(server)
      .get('/api/v1/users/requests/1')
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Request found for the user');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.request.should.be.an('object');
        res.body.data.request.should.have.property('id');
        res.body.data.request.should.have.property('title');
        res.body.data.request.should.have.property('type');
        res.body.data.request.should.have.property('description');
        res.body.data.request.should.have.property('createdAt');
        res.body.data.request.should.have.property('updatedAt');
        done();
      });
  });

  it('should return 400, when an invalid param is sent', (done) => {
    chai.request(server).get('/api/v1/users/requests/gvh').end((req, res) => {
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('code').eql(400);
      res.body.should.have.property('message').eql('Request id not valid');
      done();
    });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api/v1/users/requests/7').end((req, res) => {
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql('fail');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('message').eql('No request found for the user');
      done();
    });
  });
});
