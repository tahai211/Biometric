import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardbatchauthdetailComponent } from './cardbatchauthdetail.component';

describe('CardbatchauthdetailComponent', () => {
  let component: CardbatchauthdetailComponent;
  let fixture: ComponentFixture<CardbatchauthdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardbatchauthdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardbatchauthdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
