import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUserRepository,
    );
  });
  it('should be able to update the user avatar successfully', async () => {
    const user = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    const userUpdated = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'fileName.jpg',
    });

    expect(userUpdated.avatar).toEqual('fileName.jpg');
  });

  it('should NOT be able to update the user avatar because it does not exists', async () => {
    await expect(
      updateUserAvatarService.execute({
        userId: 'non-existing-user',
        avatarFileName: 'fileName.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar before save a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'fileName.jpg',
    });

    const userUpdated = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'newAvatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('fileName.jpg');
    expect(userUpdated.avatar).toBe('newAvatar.jpg');
  });
});
