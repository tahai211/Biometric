import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardbatchauthComponent } from './cardbatchauth.component';

describe('CardbatchauthComponent', () => {
  let component: CardbatchauthComponent;
  let fixture: ComponentFixture<CardbatchauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardbatchauthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardbatchauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
