import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EduTopicListComponent } from './edu-topic-list.component';

describe('EduTopicListComponent', () => {
  let component: EduTopicListComponent;
  let fixture: ComponentFixture<EduTopicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EduTopicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduTopicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
