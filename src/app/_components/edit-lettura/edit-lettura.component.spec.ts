import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLetturaComponent } from './edit-lettura.component';

describe('EditLetturaComponent', () => {
  let component: EditLetturaComponent;
  let fixture: ComponentFixture<EditLetturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLetturaComponent]
    });
    fixture = TestBed.createComponent(EditLetturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
