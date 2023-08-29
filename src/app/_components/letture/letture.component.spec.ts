import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LettureComponent } from './letture.component';

describe('LettureComponent', () => {
  let component: LettureComponent;
  let fixture: ComponentFixture<LettureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LettureComponent]
    });
    fixture = TestBed.createComponent(LettureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
