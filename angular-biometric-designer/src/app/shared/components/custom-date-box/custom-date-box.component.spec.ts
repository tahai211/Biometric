import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateBoxComponent } from './custom-date-box.component';

describe('CustomDateBoxComponent', () => {
  let component: CustomDateBoxComponent;
  let fixture: ComponentFixture<CustomDateBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomDateBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
