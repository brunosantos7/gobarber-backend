type MailConfig = {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
};

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'test@test.com',
      name: 'Testador dos Testes',
    },
  },
} as MailConfig;
