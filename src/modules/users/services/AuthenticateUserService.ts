import authConfig from '@config/authConfig';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repositories/IUserRepository';

type Response = {
  user: User;
  token: string;
};

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('HashProvider') private hashProvider: IHashProvider,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(email: string, password: string): Promise<Response> {
    const userRecord = await this.userRepository.findByEmail(email);

    if (!userRecord) {
      throw new AppError('Email e senha não batem.', 401);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      userRecord.password,
    );

    if (!passwordMatches) {
      throw new AppError('Email e senha não batem.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: userRecord.id,
      expiresIn,
    });

    return { user: userRecord, token };
  }
}
