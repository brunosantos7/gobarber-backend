import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fakeUserRepository: FakeUserRepository;
let listProviderService: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderService = new ListProviderService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list providers successfully', async () => {
    const user1 = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const user2 = await fakeUserRepository.save({
      email: 'joao@email.com',
      name: 'Joao',
      password: '123123',
    });

    const loggedUser = await fakeUserRepository.save({
      email: 'logged@email.com',
      name: 'Logged User',
      password: '123123',
    });

    const userProviders = await listProviderService.execute({
      user_id: loggedUser.id,
    });

    expect(userProviders).toEqual([user1, user2]);
  });
});
