import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
const should = chai.should();

describe('GET /', () => {
  it('should return 200, when base url is requested"', (done) => {
    chai.request(server)
      .get('/')
      .end((req, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Welcome to Maintenance Tracker');
        done();
      });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route not supported on server.');
      done();
    });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/ap').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route not supported on server.');
      done();
    });
  });
});
