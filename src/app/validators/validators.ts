import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Injectable()
export class CustomValidators {

  isErrorRegistration = false;

  constructor() {
  }

  equalityValue(group: FormGroup) {
    let valid = true;
    const keys = Object.keys(group.value);
    if (!Array.isArray(keys) || keys.length === 0) {
      return {
        isNotEquality: true
      };
    }

    const value = group.value[keys[0]];
    keys.forEach(key => {
      if (group.value[key] !== value) {
        valid = false;
      }
    });
    if (valid) {
      return null;
    }

    return {
      isNotEquality: true
    };
  }

  checkDirtyControl(control: FormControl) {
    return (control.dirty || control.touched);
  }

}
