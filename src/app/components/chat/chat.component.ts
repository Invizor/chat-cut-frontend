import {Component, OnInit, DoCheck, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
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
  @ViewChild('scrollWindow') private windowScrollContainer: ElementRef;
  user: User;
  listThreads: Thread[] = [];
  objUserNames = {};
  idSelectThread: string;
  currentThread: Thread;
  messageModel = '';

  constructor(
    private authService: AuthService,
    private threadService: ThreadService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private chRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.authService.getUser()
      .subscribe(user => {
        this.user = user;
        if (this.user) {
          this.threadService.getThreads()
            .subscribe(listThreads => {
              if (listThreads && listThreads.length !== this.listThreads.length) {
                this.listThreads = listThreads;
                if (Array.isArray(this.listThreads) && this.listThreads.length > 0) {
                  this.prepareListThreads()
                    .subscribe(() => {
                      this.scrollToBottom();
                    });
                }
              } else {
                console.log("listThreads", listThreads);
                this.listThreads = listThreads;
                if (this.currentThread) {
                  this.selectCurrentThread(this.currentThread['_id']);
                }
              }
            });
        }
      });
  }

  prepareListThreads() {
    this.selectCurrentThread(this.listThreads[0]['_id']);
    const listIdUsersFromAllThreads = [];
    this.listThreads.forEach(thread => {
      thread.listIdUsers.forEach(id => {
        if (listIdUsersFromAllThreads.indexOf(id) === -1) {
          listIdUsersFromAllThreads.push(id);
        }
      });
    });
    return this.authService.getUsersName(listIdUsersFromAllThreads)
      .map(result => {
        if (result && result.usersName) {
          this.objUserNames = result.usersName;
        }
        return result;
      });
  }

  openDialogNewThread(): void {
    let dialogRef = this.dialog.open(ModalNewThreadComponent, {
      width: '300px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (Array.isArray(result)) {
        this.listThreads  = result;
        this.goToCurrentThread(result[result.length - 1]['_id']);
      }
    });
  }

  selectCurrentThread(id: string) {
    this.idSelectThread = id;
    const curThreadList = this.listThreads.filter(thread => {
      return thread._id === id;
    });
    if (Array.isArray(curThreadList) && curThreadList.length > 0) {
      this.currentThread = curThreadList[0];
    }
  }

  goToCurrentThread(id: string) {
    this.selectCurrentThread(id);
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.messageModel) {
      this.messageService.createMessage(this.currentThread._id, this.messageModel)
        .subscribe(messages => {
          this.messageModel = '';
          this.listThreads.forEach(thread => {
            if (thread._id === this.currentThread._id) {
              thread.messageList = messages;
              this.currentThread = thread;
            }
          });
          this.scrollToBottom();
        },
        error => {

        });
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.windowScrollContainer.nativeElement.scrollTop = this.windowScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
    });
  }

  removeMessage(messageId: string) {
    this.messageService.removeMessage(messageId)
      .subscribe(messages => {
        const threadsListLocal = [...this.listThreads];
        threadsListLocal.forEach(thread => {
          if (thread._id === this.currentThread._id) {
            thread.messageList = messages;
          }
        });
        this.listThreads = threadsListLocal;
        this.selectCurrentThread(this.currentThread._id);
      });
  }

  removeUserFromThread(threadId, event) {
    event.stopPropagation();
    this.threadService.removeUserFromThread(threadId)
      .subscribe(() => {}, error => {});
  }

  ngDoCheck(): void {

  }

  logoutUser() {
    this.authService.logoutUser();
  }

}
