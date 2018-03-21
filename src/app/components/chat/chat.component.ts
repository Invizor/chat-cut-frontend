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
              this.listThreads.forEach(thread => {
                this.messageService.getMessages(thread['_id'])
                  .subscribe(messageList => {
                    thread.messageList = messageList;
                  });
              });
            });
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

  ngDoCheck(): void {

  }

}
