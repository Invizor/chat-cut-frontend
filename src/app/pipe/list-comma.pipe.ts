import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'listCommaCurrentField'})
export class ListCommaCurrentField implements PipeTransform {
  transform(value: object[], fieldName: string): string {
    console.log("value", value);
    const list = value.map(item => {
      return item[fieldName];
    });
    return list.join(',');
  }
}