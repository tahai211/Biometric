import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardbatchComponent } from './cardbatch.component';

describe('CardbatchComponent', () => {
  let component: CardbatchComponent;
  let fixture: ComponentFixture<CardbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardbatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
