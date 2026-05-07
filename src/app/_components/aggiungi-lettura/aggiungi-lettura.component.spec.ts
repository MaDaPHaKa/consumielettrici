import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { AggiungiLetturaComponent } from './aggiungi-lettura.component';

describe('AggiungiLetturaComponent', () => {
  let component: AggiungiLetturaComponent;
  let fixture: ComponentFixture<AggiungiLetturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AggiungiLetturaComponent],
      providers: [
        provideAnimations(),
        provideRouter([]),
        provideNativeDateAdapter(),
      ],
    });
    fixture = TestBed.createComponent(AggiungiLetturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
