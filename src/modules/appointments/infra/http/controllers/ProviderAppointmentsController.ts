import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year } = request.query;
    const provider_id = request.user.id;

    const listProviderAppointmentService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointmentService.execute({
      day: Number(day),
      provider_id,
      year: Number(year),
      month: Number(month),
    });

    return response.json(classToClass(appointments));
  }
}
