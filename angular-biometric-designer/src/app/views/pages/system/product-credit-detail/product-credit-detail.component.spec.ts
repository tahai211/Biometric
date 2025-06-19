import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreditDetailComponent } from './product-credit-detail.component';

describe('ProductCreditDetailComponent', () => {
  let component: ProductCreditDetailComponent;
  let fixture: ComponentFixture<ProductCreditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreditDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCreditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
