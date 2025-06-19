import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStatusCardComponent } from './searchstatuscard.component';

describe('SearchstatuscardComponent', () => {
  let component: SearchStatusCardComponent;
  let fixture: ComponentFixture<SearchStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStatusCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
