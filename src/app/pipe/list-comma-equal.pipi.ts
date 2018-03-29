import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'listCommaEqualField'})
export class ListCommaEqualField implements PipeTransform {
  transform(value: string[], objEqual: object): string {
    const list = value.map(item => {
      if (objEqual[item]) {
        return objEqual[item];
      }
    });
    return list.join(', ');
  }
}
