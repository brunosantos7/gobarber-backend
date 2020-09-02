import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

type Request = {
  user_id: string;
};

@injectable()
export default class ListProviderService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('CacheProvider') private cacheProvider: ICacheProvider,
  ) {}

  async execute({ user_id }: Request): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.userRepository.findAllProviders({
        except_user_id: user_id,
      });
    }

    await this.cacheProvider.save(
      `providers-list:${user_id}`,
      classToClass(users),
    );

    return users;
  }
}
