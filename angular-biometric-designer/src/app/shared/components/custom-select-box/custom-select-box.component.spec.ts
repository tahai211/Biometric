import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectBoxComponent } from './custom-select-box.component';

describe('CustomSelectBoxComponent', () => {
  let component: CustomSelectBoxComponent;
  let fixture: ComponentFixture<CustomSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSelectBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
