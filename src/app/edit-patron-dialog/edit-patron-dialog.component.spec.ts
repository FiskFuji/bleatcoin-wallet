import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatronDialogComponent } from './edit-patron-dialog.component';

describe('EditPatronDialogComponent', () => {
  let component: EditPatronDialogComponent;
  let fixture: ComponentFixture<EditPatronDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatronDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatronDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
