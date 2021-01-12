import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EduTermListComponent } from './edu-term-list.component';

describe('EduTermListComponent', () => {
  let component: EduTermListComponent;
  let fixture: ComponentFixture<EduTermListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EduTermListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduTermListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
