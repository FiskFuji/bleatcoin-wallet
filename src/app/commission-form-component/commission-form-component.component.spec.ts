import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionFormComponentComponent } from './commission-form-component.component';

describe('CommissionFormComponentComponent', () => {
  let component: CommissionFormComponentComponent;
  let fixture: ComponentFixture<CommissionFormComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionFormComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
