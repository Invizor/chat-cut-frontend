import { Pipe, PipeTransform } from '@angular/core';
import {EmojiConvertor} from 'emoji-js';

const emojiConv = new EmojiConvertor();

@Pipe({name: 'prepareTextMessage'})
export class PrepareTextMessage implements PipeTransform {
  transform(value: string): string {
    let str = value.replace(/\n/g, '<br/>');
    str = emojiConv.replace_colons(str);
    return str;
  }
}
