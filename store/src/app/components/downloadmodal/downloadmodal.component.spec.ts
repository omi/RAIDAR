import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadmodalComponent } from './downloadmodal.component';

describe('DownloadmodalComponent', () => {
  let component: DownloadmodalComponent;
  let fixture: ComponentFixture<DownloadmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
