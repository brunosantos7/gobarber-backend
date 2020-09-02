import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

type MailContact = {
  name: string;
  email: string;
};

export default interface ISendMailDTO {
  to: MailContact;
  from?: MailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
