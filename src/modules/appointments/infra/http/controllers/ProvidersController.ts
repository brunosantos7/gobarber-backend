import ListProviderService from '@modules/appointments/services/ListProviderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProvidersService = container.resolve(ListProviderService);

    const providers = await listProvidersService.execute({ user_id });

    return response.json(classToClass(providers));
  }
}
