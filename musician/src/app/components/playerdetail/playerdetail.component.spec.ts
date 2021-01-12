import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerdetailComponent } from './playerdetail.component';

describe('PlayerdetailComponent', () => {
  let component: PlayerdetailComponent;
  let fixture: ComponentFixture<PlayerdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
