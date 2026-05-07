import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';

import { LettureFilterComponent } from './letture-filter.component';

describe('LettureFilterComponent', () => {
  let component: LettureFilterComponent;
  let fixture: ComponentFixture<LettureFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LettureFilterComponent],
      providers: [provideAnimations(), provideNativeDateAdapter()],
    });
    fixture = TestBed.createComponent(LettureFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
