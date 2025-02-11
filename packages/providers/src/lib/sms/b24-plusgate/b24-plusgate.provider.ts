import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@novu/stateless';
import { BaseProvider, CasingEnum } from '../../../base.provider';
import { WithPassthrough } from '../../../utils/types';
import { ProxyAgent } from 'proxy-agent';

export class B24PlusgateSmsProvider
  extends BaseProvider
  implements ISmsProvider
{
  id = 'b24-plusgate';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  public readonly BASE_URL = 'https://cloudapi.plasgate.com/rest/send';
  protected casing: CasingEnum;
  constructor(
    private config: {
      private_key: string;
      secret_key: string;
    },
  ) {
    super();
  }

  async sendMessage(
    options: ISmsOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {},
  ): Promise<ISendMessageSuccessResponse> {
    console.log('Sending SMS with data:', this.config);
    const from = options.from || 'B24';
    const sendTo = options.to;
    const message = options.content;
    const result = await this.sendPlusGateSMS(from, sendTo, message);

    return {
      id: result.queue_id,
      date: new Date().toISOString(),
    };
  }
  // implement sendMessage method
  async sendPlusGateSMS(from: string, to: string, message: string) {
    console.log('Sending SMS with data:', { from, to, message });
    // add query params to the URL
    const url = `${this.BASE_URL}?private_key=${this.config.private_key}`;
    const myHeaders = new Headers();
    myHeaders.append(`X-Secret`, this.config.secret_key);
    myHeaders.append(`Content-Type`, 'application/json');

    const raw = JSON.stringify({
      sender: from,
      to,
      content: message,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      agent: new ProxyAgent(),
    };
    const result = await fetch(url, requestOptions);
    const data = await result.json();
    console.log('SMS sent:', data);

    return data;
  }
}
