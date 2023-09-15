import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettureFilterComponent } from './letture-filter.component';

describe('LettureFilterComponent', () => {
  let component: LettureFilterComponent;
  let fixture: ComponentFixture<LettureFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LettureFilterComponent]
    });
    fixture = TestBed.createComponent(LettureFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
