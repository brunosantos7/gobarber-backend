import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;

let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email successfully', async () => {
    const sentMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({ email: 'bruno@email.com' });

    expect(sentMailSpy).toHaveBeenCalled();
  });

  it('should NOT be able to recover non existing user passwrod', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: 'bruno@email.com' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUserRepository.save({
      email: 'bruno@email.com',
      name: 'Bruno',
      password: '123123',
    });

    await sendForgotPasswordEmailService.execute({ email: 'bruno@email.com' });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
