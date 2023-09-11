import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingPricingComponent } from './marketing-pricing.component';

describe('MarketingPricingComponent', () => {
  let component: MarketingPricingComponent;
  let fixture: ComponentFixture<MarketingPricingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarketingPricingComponent]
    });
    fixture = TestBed.createComponent(MarketingPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
