import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatronDialogComponent } from './delete-patron-dialog.component';

describe('DeletePatronDialogComponent', () => {
  let component: DeletePatronDialogComponent;
  let fixture: ComponentFixture<DeletePatronDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePatronDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePatronDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
