import { describe, it } from 'mocha';
import chai from 'chai';

import RequestRepository from '../../repositories/RequestRepository';

const { expect } = chai;
const requestRepo = new RequestRepository();
let requestId;

describe('RequestRepository', () => {
  it('should retrieve all requests', async () => {
    const requests = await requestRepo.get({});
    expect(requests[0]).to.have.property('id');
    expect(requests[0]).to.have.property('title');
    expect(requests[0]).to.have.property('type');
    expect(requests[0]).to.have.property('description');
    expect(requests[0]).to.have.property('status');
    expect(requests[0]).to.have.property('user_id');
  });

  it('should create a new request', async () => {
    const details = {
      title: 'Request 43-123',
      type: 'repair',
      description: 'My request is valid please attend to it',
      userId: 1,
    };
    const request = await requestRepo.save(details);
    expect(request).to.have.property('id');
    expect(request).to.have.property('type').equal(details.type);
    expect(request).to.have.property('title').equal(details.title);
    expect(request).to.have.property('description').equal(details.description);
    expect(request).to.have.property('user_id').equal(details.userId);
    requestId = request.id;
  });

  it('should retrieve a single request', async () => {
    const request = await requestRepo.getOne({ id: requestId });
    expect(request).to.have.property('id').equal(requestId);
    expect(request).to.have.property('title');
    expect(request).to.have.property('type');
    expect(request).to.have.property('description');
    expect(request).to.have.property('status');
  });

  it('should update an existing request', async () => {
    const details = {
      type: 'maintenance',
      description: 'My request is valid and updated',
    };
    const request = await requestRepo.update(details, { id: requestId });
    expect(request).to.have.property('id');
    expect(request).to.have.property('type').equal(details.type);
    expect(request).to.have.property('description').equal(details.description);
  });

  it('should delete a request', async () => {
    await requestRepo.delete({ id: requestId });
    const request = await requestRepo.getOne({ id: requestId });
    expect(request).to.equal(undefined);
  });

  it('should check for the existence of a request', async () => {
    const request1 = await requestRepo.exists({ id: 5 });
    const request2 = await requestRepo.exists({ id: requestId });
    expect(request1).to.equal(true);
    expect(request2).to.equal(false);
  });
});

