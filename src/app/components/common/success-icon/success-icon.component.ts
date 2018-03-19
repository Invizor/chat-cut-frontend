import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-succes-icon',
  templateUrl: './success-icon.component.html',
  styleUrls: ['./success-icon.component.css']
})
export class SuccessIconComponent implements OnInit {

  @Input() status: boolean;
  @Input() isShow: boolean;

  constructor() { }

  ngOnInit() {
  }

}
