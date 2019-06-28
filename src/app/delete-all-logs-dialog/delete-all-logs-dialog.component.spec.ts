import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllLogsDialogComponent } from './delete-all-logs-dialog.component';

describe('DeleteAllLogsDialogComponent', () => {
  let component: DeleteAllLogsDialogComponent;
  let fixture: ComponentFixture<DeleteAllLogsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAllLogsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAllLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
