import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { UsoElettrodomesticoComponent } from './uso-elettrodomestico.component';

describe('UsoElettrodomesticoComponent', () => {
  let component: UsoElettrodomesticoComponent;
  let fixture: ComponentFixture<UsoElettrodomesticoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsoElettrodomesticoComponent],
      providers: [provideAnimations()],
    });
    fixture = TestBed.createComponent(UsoElettrodomesticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
