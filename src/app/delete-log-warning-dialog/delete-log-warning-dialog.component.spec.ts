import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLogWarningDialogComponent } from './delete-log-warning-dialog.component';

describe('DeleteLogWarningDialogComponent', () => {
  let component: DeleteLogWarningDialogComponent;
  let fixture: ComponentFixture<DeleteLogWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLogWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLogWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
