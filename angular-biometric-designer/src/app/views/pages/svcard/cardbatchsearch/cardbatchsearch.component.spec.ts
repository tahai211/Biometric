import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardbatchsearchComponent } from './cardbatchsearch.component';

describe('CardbatchsearchComponent', () => {
  let component: CardbatchsearchComponent;
  let fixture: ComponentFixture<CardbatchsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardbatchsearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardbatchsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
