import { Pipe, PipeTransform } from '@angular/core';
import {Message} from '../models/message.model';
import * as moment from 'moment';

@Pipe({name: 'lastMessage'})
export class LastMessage implements PipeTransform {
  transform(listMessage: Message[]): string {
    let maxDate = moment(0).format('YYYY-MM-DD HH:mm:ss');
    let indexMaxDate = -1;
    for (let i = 0; i < listMessage.length; i++) {
      if (moment(listMessage[i].date).format('YYYY-MM-DD HH:mm:ss') >= maxDate) {
        maxDate = moment(listMessage[i].date).format('YYYY-MM-DD HH:mm:ss');
        indexMaxDate = i;
      }
    }
    if (indexMaxDate >= 0) {
      return listMessage[indexMaxDate].text;
    } else {
      return '';
    }
  }
}
