import { describe, it, before } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';

import { server } from '../../../app';
import { generateToken } from '../../helpers/jwtHelper';

chai.use(chaiHttp);
chai.should();
dotenv.config();
let token;

describe('GET /account', () => {
  before(() => {
    token = generateToken(
      { email: 'emecus10@gmail.com', id: 1, admin: true },
      '72h',
    );
  });

  it('should return 401, when access token is invalid', done => {
    chai
      .request(server)
      .get('/api/v1/auth/account')
      .set('Authorization', 'Bearer badToken623bewq842j3kr')
      .end((req, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('code').eql(401);
        res.body.should.have
          .property('message')
          .eql('Invalid authorization token');
        done();
      });
  });

  it('should return 200, when access token is valid', done => {
    chai
      .request(server)
      .get('/api/v1/auth/account')
      .set('Authorization', `Bearer ${token}`)
      .end((req, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('code').eql(200);
        res.body.data.should.have.property('firstname');
        res.body.should.have.property('data');
        res.body.data.should.have.property('lastname');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('admin');
        res.body.data.should.have.property('createdat');
        res.body.data.should.have.property('updatedat');
        res.body.should.have
          .property('message')
          .eql('User details retrieved successfully');
        done();
      });
  });
});
