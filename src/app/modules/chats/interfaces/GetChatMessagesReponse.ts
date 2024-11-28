import { BaseApiResponse } from '../../../interfaces/BaseApiResponse';
import { Message } from './Message';

export interface GetChatMessagesResponse extends BaseApiResponse {
  data: Message[];
}
