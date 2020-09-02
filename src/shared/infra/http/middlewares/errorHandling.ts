import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';

export default function errorHandling(
  error: Error,
  resquest: Request,
  response: Response,
  _: NextFunction,
): Response<unknown> {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'Error',
      message: error.message,
      stackTrace: error.stack,
    });
  }

  return response.status(500).json({
    status: 'Error',
    message: 'Ocorreu algum problema, entre em contato com o suporte!',
    stackTrace: error.stack,
  });
}
