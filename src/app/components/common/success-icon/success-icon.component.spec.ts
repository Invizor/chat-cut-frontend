import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesIconComponent } from './success-icon.component';

describe('SuccesIconComponent', () => {
  let component: SuccesIconComponent;
  let fixture: ComponentFixture<SuccesIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccesIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccesIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
