import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'dateTimeFormat'})
export class DateTimeFormat implements PipeTransform {
  transform(value: string): string {
    let result = moment(value).format('YYYY-MM-DD HH:mm:ss');
    return String(result);
  }
}
