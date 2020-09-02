import UserService from '@modules/users/services/CreateUsersService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const userService = container.resolve(UserService);

    const user = await userService.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
