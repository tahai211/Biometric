import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteronlinepaymentDetailComponent } from './registeronlinepayment-detail.component';

describe('RegisteronlinepaymentDetailComponent', () => {
  let component: RegisteronlinepaymentDetailComponent;
  let fixture: ComponentFixture<RegisteronlinepaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteronlinepaymentDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteronlinepaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
