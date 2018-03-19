import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewThreadComponent } from './modal-new-thread.component';

describe('ModalNewThreadComponent', () => {
  let component: ModalNewThreadComponent;
  let fixture: ComponentFixture<ModalNewThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
