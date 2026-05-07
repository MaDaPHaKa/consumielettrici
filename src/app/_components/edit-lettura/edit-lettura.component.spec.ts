import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EditLetturaComponent } from './edit-lettura.component';

describe('EditLetturaComponent', () => {
  let component: EditLetturaComponent;
  let fixture: ComponentFixture<EditLetturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditLetturaComponent],
      providers: [
        provideAnimations(),
        provideNativeDateAdapter(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 1,
            lettura: 100,
            consumo: 5,
            giorno: new Date(),
            escludiDaMedia: false,
            escludiDaMinMax: false,
          },
        },
      ],
    });
    fixture = TestBed.createComponent(EditLetturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
