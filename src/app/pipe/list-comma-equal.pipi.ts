import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'listCommaEqualField'})
export class ListCommaEqualField implements PipeTransform {
  transform(value: string[], objEqual: object, nameField: string): string {
    const list = value.map(item => {
      if (objEqual[item] && objEqual[item][nameField]) {
        return objEqual[item][nameField];
      }
    });
    return list.join(', ');
  }
}
