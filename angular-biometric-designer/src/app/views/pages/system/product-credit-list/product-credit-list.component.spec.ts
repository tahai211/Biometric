import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreditListComponent } from './product-credit-list.component';

describe('ProductCreditListComponent', () => {
  let component: ProductCreditListComponent;
  let fixture: ComponentFixture<ProductCreditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreditListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductCreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
