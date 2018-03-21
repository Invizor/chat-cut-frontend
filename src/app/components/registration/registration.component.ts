import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import { Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {CustomValidators} from '../../validators/validators';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class ErrorStateMatcherRepeatPassword implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const isInvalidGroupPasswords = form.control.controls['passwords'].invalid;
    return !!(((control && control.invalid) || (form && isInvalidGroupPasswords)) && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  viewModelUser = this.fb.group({
    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeat: ['', [Validators.required, Validators.minLength(8)]]
    },
    {validator: this.customValidators.equalityValue}
    ),
    email: ['', [Validators.required, Validators.email]],
    name: ['', []],
    surname: ['', []],
    username: ['', [Validators.required]]
  });
  matcherRepeatPassword = new ErrorStateMatcherRepeatPassword();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public customValidators: CustomValidators,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  getErrorText(controlField: FormControl, groupField?: FormGroup) {
    if (controlField) {
      if (controlField.hasError('required')) {
        return 'You must enter a value';
      } else
      if (controlField.hasError('email')) {
        return 'Not a valid email';
      } else
      if (controlField.hasError('minlength')) {
        return 'more than 8 characters';
      }
    }
    if (groupField) {
      if (groupField.hasError('isNotEquality')) {
        return 'passwords is not equality';
      }
    }
    return '';
  }

  sendDataForm() {
    if (this.viewModelUser.valid) {
      const userObj = {
        username: this.viewModelUser.value.username,
        password: this.viewModelUser.value.passwords.password,
        email: this.viewModelUser.value.email,
        name: this.viewModelUser.value.name,
        surname: this.viewModelUser.value.surname
      };
      this.authService.registerUser(userObj)
        .subscribe((result) => {
          const message = 'Success registration';
          this.snackBar.open(message, 'закрыть', {
            duration: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/chat'], { relativeTo: this.route });
          }, 2000);
        }, error => {
          const message = 'Registration error';
          this.snackBar.open(message, 'закрыть', {
            duration: 3000,
          });
        });
    }
  }
}
