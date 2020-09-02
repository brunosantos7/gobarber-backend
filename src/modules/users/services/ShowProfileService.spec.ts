import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show the user profile successfully', async () => {
    const user = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const userProfile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(userProfile.name).toBe('Bruno');
    expect(userProfile.email).toBe('bruno@email.com');
  });

  it('should not be able to show the user profile from a non-existing user', async () => {
    expect(
      showProfileService.execute({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
