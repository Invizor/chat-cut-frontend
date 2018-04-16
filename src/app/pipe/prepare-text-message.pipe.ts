import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prepareTextMessage'})
export class PrepareTextMessage implements PipeTransform {
  transform(value: string): string {
    let str = value.replace(/\n/g, '<br/>');
    return str;
  }
}
