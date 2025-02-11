import { ChannelTypeEnum, ICredentials, SmsProviderIdEnum } from '@novu/shared';
import { B24PlusgateSmsProvider } from '@novu/providers';
import { BaseSmsHandler } from './base.handler';

export class B24PlusGateSmsHandler extends BaseSmsHandler {
  constructor() {
    super(SmsProviderIdEnum.B24PlusGate, ChannelTypeEnum.SMS);
  }

  buildProvider(credentials: ICredentials) {
    if (!credentials.apiKey || !credentials.secretKey) {
      throw new Error('API key or secret key is undefined');
    }
    const config = {
      private_key: credentials.apiKey,
      secret_key: credentials.secretKey,
    };

    this.provider = new B24PlusgateSmsProvider(config);
  }
}
