import { describe, it } from 'mocha';
import chai from 'chai';

import UserRepository from '../../repositories/UserRepository';

const { expect } = chai;
const userRepo = new UserRepository();
let userId;

describe('UserRepository', () => {
  it('should retrieve all users', async () => {
    const users = await userRepo.get({});
    expect(users[0]).to.have.property('id').equal(1);
    expect(users[0]).to.have.property('firstname');
    expect(users[0]).to.have.property('lastname');
    expect(users[0]).to.have.property('email');
    expect(users[0]).to.have.property('password');
  });

  it('should create a new user', async () => {
    const details = {
      firstname: 'Test',
      lastname: 'User',
      email: 'mail54284h3@mail.com',
      password: 'ty7ry8j0fi5ifhu5yfg',
    };
    const user = await userRepo.save(details);
    expect(user).to.have.property('id');
    expect(user).to.have.property('firstname').equal(details.firstname);
    expect(user).to.have.property('lastname').equal(details.lastname);
    expect(user).to.have.property('email').equal(details.email);
    userId = user.id;
  });

  it('should retrieve a single user', async () => {
    const user = await userRepo.getOne({ id: userId });
    expect(user).to.have.property('id').equal(userId);
    expect(user).to.have.property('firstname');
    expect(user).to.have.property('lastname');
    expect(user).to.have.property('email');
    expect(user).to.have.property('password');
  });

  it('should update an existing user', async () => {
    const details = {
      firstname: 'Update',
      lastname: 'Updated',
      email: 'mail54284h3@mail.com',
    };
    const user = await userRepo.update(details, { id: userId });
    expect(user).to.have.property('id').equal(userId);
    expect(user).to.have.property('firstname').equal(details.firstname);
    expect(user).to.have.property('lastname').equal(details.lastname);
    expect(user).to.have.property('email').equal(details.email);
  });

  it('should delete a user', async () => {
    await userRepo.delete({ id: userId });
    const user = await userRepo.getOne({ id: userId });
    expect(user).to.equal(undefined);
  });

  it('should check for the existence of a user', async () => {
    const user1 = await userRepo.exists({ id: userId });
    const user2 = await userRepo.exists({ id: 1 });
    expect(user1).to.equal(false);
    expect(user2).to.equal(true);
  });
});
