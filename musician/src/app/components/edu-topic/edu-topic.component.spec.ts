import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EduTopicComponent } from './edu-topic.component';

describe('EduTopicComponent', () => {
  let component: EduTopicComponent;
  let fixture: ComponentFixture<EduTopicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EduTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
