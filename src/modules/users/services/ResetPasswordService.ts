import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

type Request = {
  password: string;
  token: string;
};

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token para resetar a senha nao existe.');
    }

    const expiredDate = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), expiredDate)) {
      throw new AppError('Token ja esta expirado.');
    }

    const user = await this.userRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('Usuario nao existe');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.save(user);
  }
}
