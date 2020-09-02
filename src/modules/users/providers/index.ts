import { container } from 'tsyringe';

import IHashProviderfrom from './HashProvider/model/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProviderfrom>(
  'HashProvider',
  BCryptHashProvider,
);
