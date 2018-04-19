export class Message {
  _id?: string;
  idThread: string;
  idUser: string;
  text: string;
  date?: Date;
  files?: string[];
}
