import { describe, it } from 'mocha';
import chai from 'chai';
import Request from '../models/request';

const should = chai.should();

describe('Test Request Model', () => {
  it('It should instantiate a new Request object', (done) => {
    const result = new Request(Request.count, 'Bad Refrigerator', 'Repair', 'Refrigerator has not worked for days');
    result.should.be.an('object');
    result.should.have.property('id');
    result.should.have.property('title').eql('Bad Refrigerator');
    result.should.have.property('type').eql('Repair');
    result.should.have.property('description').eql('Refrigerator has not worked for days');
    result.should.have.property('createdAt');
    result.should.have.property('updatedAt');
    done();
  });

  it('It should return a list of requests', (done) => {
    const result = Request.getRequest();
    result.should.be.an('array');
    result[0].should.have.property('id');
    result[0].should.have.property('title');
    result[0].should.have.property('type');
    result[0].should.have.property('description');
    result[0].should.have.property('createdAt');
    result[0].should.have.property('updatedAt');
    done();
  });

  it('It should update a request', (done) => {
    const result = Request.updateRequest(0, new Request(
      Request.count(),
      'My Television',
      'Repair',
      "My Television displays black and white and doesn't dispaly colors",
    ));
    result.should.be.a('boolean');
    result.should.eql(true);
    done();
  });

  it('It should create a request', (done) => {
    const result = Request.createRequest(new Request(
      Request.count(),
      'My Television',
      'Repair',
      "My Television displays black and white and doesn't dispaly colors",
    ));
    result.should.be.a('boolean');
    result.should.eql(true);
    done();
  });

  it('It should return a request', (done) => {
    const result = Request.getRequestById(1);
    result.should.be.an('object');
    result.should.have.property('id');
    result.should.have.property('title');
    result.should.have.property('type');
    result.should.have.property('description');
    result.should.have.property('createdAt');
    result.should.have.property('updatedAt');
    done();
  });

  it('It should return the number of requets', (done) => {
    const result = Request.count();
    result.should.be.a('number');
    done();
  });
});
