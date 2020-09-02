import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

type Request = {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
};

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário nao encontrado.');
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email ja está em uso');
    }

    user.name = name;
    user.email = email;

    if (password && !oldPassword) {
      throw new AppError('Você precisa informar a senha antiga.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Senha antiga nao é valida.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}
