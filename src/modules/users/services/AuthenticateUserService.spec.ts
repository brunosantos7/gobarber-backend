import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUsersService from './CreateUsersService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProviderRepository: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;
let createUsersService: CreateUsersService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProviderRepository = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeHashProviderRepository,
      fakeUserRepository,
    );
    createUsersService = new CreateUsersService(
      fakeHashProviderRepository,
      fakeUserRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to authenticate', async () => {
    const user = await createUsersService.execute({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const response = await authenticateUserService.execute(
      'bruno@email.com',
      '123123',
    );

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should NOT be able to authenticate because the email does not exist', async () => {
    await createUsersService.execute({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await expect(
      authenticateUserService.execute('brunoss@email.com', '123123'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to authenticate because the password does not match', async () => {
    await createUsersService.execute({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await expect(
      authenticateUserService.execute('bruno@email.com', '111111'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
