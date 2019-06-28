import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchAddCoinsDialogComponent } from './batch-add-coins-dialog.component';

describe('BatchAddCoinsDialogComponent', () => {
  let component: BatchAddCoinsDialogComponent;
  let fixture: ComponentFixture<BatchAddCoinsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchAddCoinsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchAddCoinsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
