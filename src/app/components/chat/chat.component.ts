import {Component, OnInit, DoCheck, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';
import { MessageService } from '../../services/message.service';
import { ImageService } from '../../services/image.service';
import { User } from '../../models/user.model';
import { Thread } from '../../models/thread.model';
import { Message } from '../../models/message.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {ModalNewThreadComponent} from './modal-new-thread/modal-new-thread.component';
import {Subject} from 'rxjs/Subject';
import {EmojiConvertor} from 'emoji-js';
const emojiConv = new EmojiConvertor();

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('scrollWindow') private windowScrollContainer: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  user: User;
  listThreads: Thread[] = [];
  objUserInfo = {};
  idSelectThread: string;
  currentThread: Thread;
  messageModel = '';
  messageModelVisual = '';
  filesModel = [];
  listSub = [];
  isOpenSmileWindow = false;

  constructor(
    private authService: AuthService,
    private threadService: ThreadService,
    private messageService: MessageService,
    private imageService: ImageService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private chRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.authService.getUser()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user = user;
        if (this.user) {
          this.threadService.getThreads()
            .takeUntil(this.destroy$)
            .subscribe(listThreads => {
              if (listThreads && listThreads.length !== this.listThreads.length) {
                this.listThreads = listThreads;
                if (Array.isArray(this.listThreads) && this.listThreads.length > 0) {
                  this.prepareListThreads()
                    .takeUntil(this.destroy$)
                    .subscribe(() => {
                      this.scrollToBottom();
                    });
                }
              } else {
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
    return this.authService.getUsersInfo(listIdUsersFromAllThreads)
      .map(result => {
        if (result && result.data) {
          this.objUserInfo = result.data;
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
      const messageForSend = this.messageModel;
      const listFilesForSend = this.filesModel;
      this.clearTextArea();
      this.filesModel = [];
      this.messageService.createMessage(this.currentThread._id, messageForSend, listFilesForSend)
        .takeUntil(this.destroy$)
        .subscribe(messages => {
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

  clearTextArea() {
    this.messageModel = '';
    this.messageModelVisual = '';
    document.getElementById('textarea-visual').innerHTML = '';
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.windowScrollContainer.nativeElement.scrollTop = this.windowScrollContainer.nativeElement.scrollHeight;
      }
      catch(err) {}
    });
  }

  removeMessage(messageId: string) {
    this.messageService.removeMessage(messageId)
      .takeUntil(this.destroy$)
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
      .takeUntil(this.destroy$)
      .subscribe(() => {}, error => {});
  }

  ngDoCheck(): void {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  logoutUser() {
    this.authService.logoutUser();
  }

  openSelectFileInput(event) {
    const element = document.getElementById('file-load');
    element.click();
  }

  selectImagesAtInput(event) {
    const tgt = event.target;
    const files = Object.values(tgt.files);
    if (Array.isArray(files) && files.length > 0) {
      files.forEach(file => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.imageService.uploadFile(formData)
          .subscribe(result => {
            if (result && result.data) {
              this.filesModel.push(result.data);
            }
          }, error => {
            this.snackBar.open('File was not load', 'close', {
              duration: 3000,
            });
          });
      });
    }
  }

  removeFileFromMessage(ind) {
    if (typeof(ind) === 'number' && this.filesModel[ind]) {
      this.filesModel.splice(ind, 1);
      this.filesModel = [...this.filesModel];
    }
  }

  openSmileWindow() {
    this.isOpenSmileWindow = !this.isOpenSmileWindow;
  }

  addEmoji(event) {
    if (event && event.emoji && event.emoji.colons) {
      this.messageModel += event.emoji.colons;
    }
    this.messageModelVisual = this.messageModel;
    this.isOpenSmileWindow = false;
  }

  changeMessageVisual(event) {
    console.log("event", event);
    if (event && event.target && typeof(event.target.innerText) === 'string') {
      this.messageModel = event.target.innerText;
    }
  }

}
