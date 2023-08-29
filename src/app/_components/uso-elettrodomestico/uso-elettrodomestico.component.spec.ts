import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoElettrodomesticoComponent } from './uso-elettrodomestico.component';

describe('UsoElettrodomesticoComponent', () => {
  let component: UsoElettrodomesticoComponent;
  let fixture: ComponentFixture<UsoElettrodomesticoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsoElettrodomesticoComponent]
    });
    fixture = TestBed.createComponent(UsoElettrodomesticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
