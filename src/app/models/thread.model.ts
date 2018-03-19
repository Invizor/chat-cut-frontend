import {Message} from './message.model';

export class Thread {
  _id?: string;
  listIdUsers?: string[];
  createDate?: Date;
  messageList?: Message[];
}
