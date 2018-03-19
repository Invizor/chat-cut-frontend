import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private threadService: ThreadService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    // this.authService.registerUser({
    //   username: 'Tonya',
    //   password: '12345678',
    //   email: 'tonya@mail.ru',
    //   name: 'Антонина',
    //   surname: 'Суркова'
    // });
    //this.authService.getUser();
    // this.authService.loginUser('tonya@mail.ru', '12345678').subscribe(result => {
    //   console.log("result", result);
    // });
    // this.threadService.getThread('5a9e6d8ff81b3b03df2e6de4').subscribe(result => {
    //   console.log("result", result);
    // },
    // (error) => {
    //   console.log("error", error);
    // });

    // this.messageService.createMessage('5a9e6d8ff81b3b03df2e6de4', 'Привет мой дорогой друг').subscribe(result => {
    //     console.log("result", result);
    //   },
    //   (error) => {
    //     console.log("error", error);
    //   });
  }

}
