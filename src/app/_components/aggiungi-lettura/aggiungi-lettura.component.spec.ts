import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiLetturaComponent } from './aggiungi-lettura.component';

describe('AggiungiLetturaComponent', () => {
  let component: AggiungiLetturaComponent;
  let fixture: ComponentFixture<AggiungiLetturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiLetturaComponent]
    });
    fixture = TestBed.createComponent(AggiungiLetturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
