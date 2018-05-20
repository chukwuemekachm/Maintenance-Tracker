import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../app';

chai.use(chaiHttp);
const should = chai.should();

describe('PUT /', () => {
  /* it('should return 200 and request, when properties are valid', (done) => {
        chai.request(server)
            .put('/api/v1/users/requests/0')
            .send({
                title: 'Wet Air Conditioner pipe',
                type: 'Repair',
                description: 'The new Air conditioner is not draining properly',
            })
            .end((req, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                res.body.should.have.property('message').eql('Request updated successfully');
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
    }); */

  it('should return 400, when title is sent but invalid', (done) => {
    chai.request(server).put('/api/v1/users/requests/0')
      .send({
        title: '  ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('title is invalid');
        done();
      });
  });

  it('should return 400, when type is invalid or null', (done) => {
    chai.request(server).put('/api/v1/users/requests/0')
      .send({
        type: '    ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('type is invalid');
        done();
      });
  });

  it('should return 400, when description is sent but invalid', (done) => {
    chai.request(server).put('/api/v1/users/requests/0')
      .send({
        description: '  ',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('description is invalid');
        done();
      });
  });

  it('should return 404, when request does not exist', (done) => {
    chai.request(server).put('/api/v1/users/requests/8')
      .send({
        title: 'Fridge',
        type: 'Repair',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('fail');
        res.body.should.have.property('code').eql(404);
        res.body.should.have.property('message').eql('Request not found');
        done();
      });
  });

  it('should return 400, when id param is not a number', (done) => {
    chai.request(server).put('/api/v1/users/requests/hbh')
      .send({
        title: 'Burnt Air Conditioner',
        type: 'Repair',
        description: 'The new Air conditioner in my office got burnt',
      })
      .end((req, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('code').eql(400);
        res.body.should.have.property('message').eql('Request id not valid');
        done();
      });
  });

  /* it('should return 400, when description is invalid or null', (done) => {
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
    }); */
});
