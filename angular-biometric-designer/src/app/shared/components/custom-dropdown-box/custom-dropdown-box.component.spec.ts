import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropdownBoxComponent } from './custom-dropdown-box.component';

describe('CustomDropdownBoxComponent', () => {
  let component: CustomDropdownBoxComponent;
  let fixture: ComponentFixture<CustomDropdownBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDropdownBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDropdownBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
