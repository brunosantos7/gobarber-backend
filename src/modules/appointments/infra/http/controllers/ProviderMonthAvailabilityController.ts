import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const monthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const availabilities = await monthAvailabilityService.execute({
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return response.json(availabilities);
  }
}
