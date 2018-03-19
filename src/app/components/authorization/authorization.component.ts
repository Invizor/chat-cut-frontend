import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import { Router, ActivatedRoute} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  viewModelUser = {
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.email])
  };
  isValidData = true;
  isErrorAuthorization = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  getErrorEmail() {
    return this.viewModelUser.email.hasError('required') ? 'You must enter a value' :
      this.viewModelUser.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  getErrorPassword() {
    return this.viewModelUser.password.hasError('required') ? 'You must enter a value' :
      this.viewModelUser.password.hasError('minlength') ? 'more than 8 characters' :
        '';
  }

  validateData() {
    if (this.viewModelUser.email.hasError('required') || this.viewModelUser.email.hasError('email')) {
      this.isValidData = false;
    } else
    if (this.viewModelUser.password.hasError('required') || this.viewModelUser.password.hasError('minlength')) {
      this.isValidData = false;
    } else {
      this.isValidData = true;
    }
  }

  sendAuthorizationData() {
    this.validateData();
    if (this.isValidData) {
      this.authService.loginUser(this.viewModelUser.email.value, this.viewModelUser.password.value)
        .subscribe((result) => {
          this.isErrorAuthorization = false;
          this.router.navigate(['/chat'], { relativeTo: this.route });
        }, error => {
          this.isErrorAuthorization = true;
        });
    }
  }

}
