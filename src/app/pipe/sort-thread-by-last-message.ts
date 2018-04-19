import { Pipe, PipeTransform } from '@angular/core';
import {Thread} from '../models/thread.model';
import {Message} from '../models/message.model';
import * as moment from 'moment';

@Pipe({name: 'sortThreadByLastMessage'})
export class SortThreadByLastMessage implements PipeTransform {

  getMaxDateFromList(list: Message[]) {
    let maxDate = moment(0).format('YYYY-MM-DD HH:mm:ss');
    for (let i = 0; i < list.length; i++) {
      if (moment(list[i].date).format('YYYY-MM-DD HH:mm:ss') >= maxDate) {
        maxDate = moment(list[i].date).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    return maxDate;
  }

  sortThread(a, b) {
    if (moment(a['maxMessagesDate']).format('YYYY-MM-DD HH:mm:ss') >= moment(b['maxMessagesDate']).format('YYYY-MM-DD HH:mm:ss')) {
      return -1;
    } else {
      return 1;
    }
  }

  transform(listThread: Thread[]): Thread[] {
    const listThreadLocal = [...listThread];
    for (let i = 0; i < listThreadLocal.length; i++) {
      listThreadLocal[i]['maxMessagesDate'] = this.getMaxDateFromList(listThreadLocal[i].messageList);
    }
    listThreadLocal.sort((a, b) => {
      return this.sortThread(a, b);
    });
    return listThreadLocal;
  }
}
