import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ThreadService} from '../../../services/thread.service';

@Component({
  selector: 'app-modal-new-thread',
  templateUrl: './modal-new-thread.component.html',
  styleUrls: ['./modal-new-thread.component.css']
})
export class ModalNewThreadComponent implements OnInit {
  public valueInput = '';
  public viewListAddUser = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataModal: any,
    public dialogRef: MatDialogRef<ModalNewThreadComponent>,
    private authService: AuthService,
    private threadService: ThreadService,
    public snackBar: MatSnackBar
  ) { }

  searchUser() {
    const userName = this.valueInput;
    if (typeof(userName) === 'string' && userName.length > 0) {
      this.authService.findUser(userName)
        .subscribe(idUser => {
          if (idUser) {
            if (idUser === this.dataModal.user['_id']) {
              this.snackBar.open('You can not add yourself', 'close', {
                duration: 3000,
              });
              return;
            }
            const isEqualUsers = this.viewListAddUser.filter(itemUser => {
              return itemUser.id === idUser;
            });
            if (isEqualUsers && isEqualUsers.length > 0) {
              this.snackBar.open('You already added this user', 'close', {
                duration: 3000,
              });
              return;
            }
            const viewList = [...this.viewListAddUser];
            viewList.push({
              id: idUser,
              username: userName
            });
            this.viewListAddUser = viewList;
            console.log("this.viewListAddUser", this.viewListAddUser);
          }
        }, error => {
          this.snackBar.open('User not found', 'close', {
            duration: 3000,
          });
        });
    }
    this.valueInput = '';
  }

  createThread() {
    let listUsersAtThread = [];
    if (this.viewListAddUser && this.viewListAddUser.length > 0) {
      listUsersAtThread = this.viewListAddUser.map(itemUser => itemUser.id);
      listUsersAtThread.push(this.dataModal.user['_id']);
      this.threadService.createThread(listUsersAtThread)
        .subscribe(() => {});
    } else {
      return;
    }
  }

  ngOnInit() {
    console.log("this.dataModal", this.dataModal);
  }

}
