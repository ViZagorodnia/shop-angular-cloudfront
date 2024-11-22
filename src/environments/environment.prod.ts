import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://00n4bihmhg.execute-api.us-east-1.amazonaws.com/prod',
    order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    import: 'https://ifzahebe57.execute-api.us-east-1.amazonaws.com/prod',
    bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    cart: 'https://7shd7v1ujb.execute-api.us-east-1.amazonaws.com/prod',
  },
  apiEndpointsEnabled: {
    product: true,
    order: false,
    import: true,
    bff: false,
    cart: true,
  },
};
