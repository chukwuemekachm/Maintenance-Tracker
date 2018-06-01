import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
chai.should();

describe('GET /', () => {
  it('should redirect to api docs"', (done) => {
    chai.request(server)
      .get('/api/v1/docs')
      .end((req, res) => {
        res.should.redirectTo('https://maintenancetracker1.docs.apiary.io/#');
        done();
      });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route unavailable on server.');
      done();
    });
  });

  it('should return 404, when an unavailable route is requested', (done) => {
    chai.request(server).get('/api/vi/ok').end((req, res) => {
      res.should.have.status(404);
      res.should.be.a('object');
      res.body.should.have.property('code').eql(404);
      res.body.should.have.property('status').eql('error');
      res.body.should.have.property('message').eql('Route unavailable on server.');
      done();
    });
  });
});
