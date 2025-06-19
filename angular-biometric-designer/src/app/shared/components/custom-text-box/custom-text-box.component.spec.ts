import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextBoxComponent } from './custom-text-box.component';

describe('CustomTextBoxComponent', () => {
  let component: CustomTextBoxComponent;
  let fixture: ComponentFixture<CustomTextBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTextBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
