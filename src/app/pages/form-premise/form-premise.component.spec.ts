import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPremiseComponent } from './form-premise.component';

describe('FormPremiseComponent', () => {
  let component: FormPremiseComponent;
  let fixture: ComponentFixture<FormPremiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPremiseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPremiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
