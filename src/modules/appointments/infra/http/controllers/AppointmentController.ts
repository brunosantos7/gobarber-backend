import AppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const appointmentService = container.resolve(AppointmentService);

    const appointment = await appointmentService.execute({
      date,
      provider_id,
      user_id,
    });

    return response.json(appointment);
  }
}
