import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { ElettrodomesticiComponent } from './elettrodomestici.component';

describe('ElettrodomesticiComponent', () => {
  let component: ElettrodomesticiComponent;
  let fixture: ComponentFixture<ElettrodomesticiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ElettrodomesticiComponent],
      providers: [provideAnimations()],
    });
    fixture = TestBed.createComponent(ElettrodomesticiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
