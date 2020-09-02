import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUserRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeHashProvider,
      fakeUserRepository,
    );
  });

  it('should be able to update the user profile successfully', async () => {
    const user = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'Bruno Test',
      email: 'newemail@email.com',
    });

    expect(userUpdated.name).toBe('Bruno Test');
    expect(userUpdated.email).toBe('newemail@email.com');
  });

  it('should not be able to update the user profile from a non-existing user', async () => {
    expect(
      updateProfileService.execute({
        user_id: 'non-existing',
        name: 'test',
        email: 'test@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to change the email to an existing one', async () => {
    await fakeUserRepository.save({
      email: 'user1@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const user2 = await fakeUserRepository.save({
      name: 'Bruno Test',
      email: 'user2@email.com',
      password: '123123',
    });

    await expect(
      updateProfileService.execute({
        user_id: user2.id,
        name: 'Bruno Test',
        email: 'user1@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password successfully', async () => {
    const user = await fakeUserRepository.save({
      email: 'user1@email.com',
      name: 'Bruno',
      password: '123456',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'Bruno Test',
      email: 'newemail@email.com',
      oldPassword: '123456',
      password: '123123',
    });

    expect(userUpdated.password).toBe('123123');
  });

  it('should NOT be able to update the password', async () => {
    const user = await fakeUserRepository.save({
      email: 'user1@email.com',
      name: 'Bruno',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Bruno Test',
        email: 'newemail@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.save({
      email: 'user1@email.com',
      name: 'Bruno',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Bruno Test',
        email: 'newemail@email.com',
        oldPassword: '33333',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
