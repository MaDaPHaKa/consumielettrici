import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LetturaElettrodomesticiComponent } from './lettura-elettrodomestici.component';

describe('LetturaElettrodomesticiComponent', () => {
  let component: LetturaElettrodomesticiComponent;
  let fixture: ComponentFixture<LetturaElettrodomesticiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LetturaElettrodomesticiComponent],
      providers: [
        provideAnimations(),
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { lettura: { giorno: new Date() }, uso: undefined },
        },
      ],
    });
    fixture = TestBed.createComponent(LetturaElettrodomesticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
