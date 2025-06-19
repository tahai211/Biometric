import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateBoxFormComponent } from './custom-date-box-form.component';

describe('CustomDateBoxFormComponent', () => {
  let component: CustomDateBoxFormComponent;
  let fixture: ComponentFixture<CustomDateBoxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateBoxFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDateBoxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
