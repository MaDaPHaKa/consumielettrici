import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';

import { LettureComponent } from './letture.component';

describe('LettureComponent', () => {
  let component: LettureComponent;
  let fixture: ComponentFixture<LettureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LettureComponent],
      providers: [provideAnimations(), provideNativeDateAdapter()],
    });
    fixture = TestBed.createComponent(LettureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
