import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCardNotActiveComponent } from './search-card-not-active.component';

describe('SearchCardNotActiveComponent', () => {
  let component: SearchCardNotActiveComponent;
  let fixture: ComponentFixture<SearchCardNotActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCardNotActiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchCardNotActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
