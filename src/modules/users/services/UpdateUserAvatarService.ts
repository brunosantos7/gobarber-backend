import User from '@modules/users/infra/typeorm/entities/User';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';

type Request = {
  userId: string;
  avatarFileName: string;
};

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('StorageProvider') private storageProvider: IStorageProvider,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  public async execute({ userId, avatarFileName }: Request): Promise<User> {
    const userRecorded = await this.userRepository.findById(userId);

    if (!userRecorded) {
      throw new AppError('Usuario nao encontrado', 401);
    }

    if (userRecorded.avatar) {
      this.storageProvider.deleteFile(userRecorded.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    userRecorded.avatar = fileName;

    const userUpdated = await this.userRepository.update(userRecorded);

    return userUpdated;
  }
}
