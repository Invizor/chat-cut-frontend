import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {ImageService} from '../../services/image.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
export class UserSettingsComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.authService.getUser()
      .subscribe((user) => {
        this.user = user;
        console.log("user", user);
      });
  }

  logoutUser() {
    this.authService.logoutUser();
  }

  selectImagesAtInput(event) {
    const tgt = event.target;
    const files = Object.values(tgt.files);
    const formData = new FormData();
    if (Array.isArray(files) && files.length > 0) {
      formData.append('avatar', files[0], files[0].name);
      this.imageService.uploadAvatar(formData)
        .subscribe(result => {
          console.log("result", result);
        });
    }
  }

  openSelectFileInput() {
    const element = document.getElementById('file-load-input');
    element.click();
  }
}
