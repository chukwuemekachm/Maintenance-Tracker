/** imports */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

/** instantiations */
const should = chai.should();
chai.use(chaiHttp);

/**
 * tests
 * It should test baseurl and return 200 if it's successful
 * else it should return 404 if route is not supported
 *  */
describe('GET /', () => {
  it('should return 200 and message, "Welcome to Maintenance Tracker."', (done) => {
    chai.request(server)
      .get('/')
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 404 and message, "Route is not supported on the server." when an unavailable route is requested', (done) => {
    chai.request(server).get('/api').end((req, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should return 404 and message, "Route is not supported on the server." when an unavailable route is requested', (done) => {
    chai.request(server).get('/ap').end((req, res) => {
      res.should.have.status(404);
      done();
    });
  });
});
