import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteronlinepaymentListComponent } from './registeronlinepayment-list.component';

describe('RegisteronlinepaymentListComponent', () => {
  let component: RegisteronlinepaymentListComponent;
  let fixture: ComponentFixture<RegisteronlinepaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteronlinepaymentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteronlinepaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
