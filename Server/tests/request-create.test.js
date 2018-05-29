import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
const should = chai.should();

describe('POST /', () => {
  it('should return 201 and request, when properties are valid', (done) => {
    chai.request(server)
      .post('/api/v1/users/requests/')
      .send({
        title: 'Burnt Air Conditioner',
        type: 'Repair',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(201);
        res.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Request created successfully');
        res.body.should.have.property('code').eql(201);
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

  it('should return 400, when title is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests')
      .send({
        type: 'Repair',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('title is required or invalid');
        done();
      });
  });

  it('should return 400, when type is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests')
      .send({
        title: 'Burnt Air Conditioner',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('type is required or invalid');
        done();
      });
  });

  it('should return 400, when description is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests/')
      .send({
        title: 'Burnt Air Conditioner',
        type: 'Repair',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('description is required or invalid');
        done();
      });
  });

  it('should return 400, when title is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests')
      .send({
        title: '    ',
        type: 'Repair',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 400, when type is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests')
      .send({
        title: 'Burnt Air Conditioner',
        type: '    ',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('should return 400, when description is invalid or null', (done) => {
    chai.request(server).post('/api/v1/users/requests/')
      .send({
        title: 'Burnt Air Conditioner',
        type: 'Repair',
        description: '    ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message');
        done();
      });
  });
});
