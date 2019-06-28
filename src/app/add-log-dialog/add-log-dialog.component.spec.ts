import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogDialogComponent } from './add-log-dialog.component';

describe('AddLogDialogComponent', () => {
  let component: AddLogDialogComponent;
  let fixture: ComponentFixture<AddLogDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLogDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
