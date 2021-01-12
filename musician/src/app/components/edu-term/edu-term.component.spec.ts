import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EduTermComponent } from './edu-term.component';

describe('EduTermComponent', () => {
  let component: EduTermComponent;
  let fixture: ComponentFixture<EduTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EduTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
