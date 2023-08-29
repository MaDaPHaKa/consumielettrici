import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetturaElettrodomesticiComponent } from './lettura-elettrodomestici.component';

describe('LetturaElettrodomesticiComponent', () => {
  let component: LetturaElettrodomesticiComponent;
  let fixture: ComponentFixture<LetturaElettrodomesticiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LetturaElettrodomesticiComponent]
    });
    fixture = TestBed.createComponent(LetturaElettrodomesticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
