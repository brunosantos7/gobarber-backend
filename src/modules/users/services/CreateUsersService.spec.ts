import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUsersService from './CreateUsersService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProviderRepository: FakeHashProvider;
let createUsersService: CreateUsersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProviderRepository = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    fakeCacheProvider = new FakeCacheProvider();

    createUsersService = new CreateUsersService(
      fakeHashProviderRepository,
      fakeUserRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user successfully', async () => {
    const user = await createUsersService.execute({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('bruno@email.com');
  });

  it('should NOT be able to create a new user with an email already recorded', async () => {
    await createUsersService.execute({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await expect(
      createUsersService.execute({
        email: 'bruno@email.com',
        name: 'Bruno',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
