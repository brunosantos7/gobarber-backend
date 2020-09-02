import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';

type Request = {
  name: string;
  email: string;
  password: string;
};

@injectable()
export default class UserService {
  constructor(
    @inject('HashProvider') private hashProvider: IHashProvider,

    @inject('UserRepository') private userRepository: IUserRepository,

    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Este email ja esta sendo utilizado.');
    }

    const passHashed = await this.hashProvider.generateHash(password);

    const userRecorded = await this.userRepository.save({
      name,
      email,
      password: passHashed,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return userRecorded;
  }
}
