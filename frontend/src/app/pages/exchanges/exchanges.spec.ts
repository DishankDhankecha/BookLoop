import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exchanges } from './exchanges';

describe('Exchanges', () => {
  let component: Exchanges;
  let fixture: ComponentFixture<Exchanges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exchanges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exchanges);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
