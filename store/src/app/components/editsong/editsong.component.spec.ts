import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsongComponent } from './editsong.component';

describe('EditsongComponent', () => {
  let component: EditsongComponent;
  let fixture: ComponentFixture<EditsongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
