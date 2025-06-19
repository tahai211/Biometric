import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvcardComponent } from './svcard.component';

describe('SvcardComponent', () => {
  let component: SvcardComponent;
  let fixture: ComponentFixture<SvcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvcardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SvcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
