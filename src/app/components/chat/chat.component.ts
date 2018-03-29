import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';
import { MessageService } from '../../services/message.service';
import { User } from '../../models/user.model';
import { Thread } from '../../models/thread.model';
import { Message } from '../../models/message.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ModalNewThreadComponent} from './modal-new-thread/modal-new-thread.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, DoCheck {
  user: User;
  listThreads: Thread[];
  objUserNames = {};
  idSelectThread: string;
  currentThread: Thread;
  messageModel = '';

  constructor(
    private authService: AuthService,
    private threadService: ThreadService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.authService.getUser()
      .subscribe(user => {
        this.user = user;
        if (this.user) {
          this.threadService.getThreads()
            .subscribe(listThreads => {
              this.listThreads = listThreads;
              if (Array.isArray(this.listThreads) && this.listThreads.length > 0) {
                this.prepareListThreads();
              }
            });
        }
      });
  }

  prepareListThreads() {
    this.selectCurrentThread(this.listThreads[0]['_id']);
    this.listThreads.forEach(thread => {
      this.messageService.getMessages(thread['_id'])
        .subscribe(messageList => {
          thread.messageList = messageList;
          console.log("this.listThreads", this.listThreads);
        });
    });
    const listIdUsersFromAllThreads = [];
    this.listThreads.forEach(thread => {
      thread.listIdUsers.forEach(id => {
        if (listIdUsersFromAllThreads.indexOf(id) === -1) {
          listIdUsersFromAllThreads.push(id);
        }
      });
    });
    this.authService.getUsersName(listIdUsersFromAllThreads)
      .subscribe(result => {
        if (result && result.usersName) {
          this.objUserNames = result.usersName;
        }
      });
  }

  openDialogNewThread(): void {
    let dialogRef = this.dialog.open(ModalNewThreadComponent, {
      width: '300px',
      data: { user: this.user }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  selectCurrentThread(id: string) {
    this.idSelectThread = id;
    const curThreadList = this.listThreads.filter(thread => {
      return thread._id === id;
    });
    if (Array.isArray(curThreadList) && curThreadList.length > 0) {
      this.currentThread = curThreadList[0];
      console.log("currentThread", this.currentThread);
    }
  }

  sendMessage() {
    if (this.messageModel) {
      this.messageService.createMessage(this.currentThread._id, this.messageModel)
        .subscribe(messages => {
          this.messageModel = '';
          this.listThreads.forEach(thread => {
            if (thread === this.currentThread._id) {
              thread.messageList = messages;
              this.currentThread = thread;
            }
          });
        },
        error => {

        });
    }
  }

  ngDoCheck(): void {

  }

}
