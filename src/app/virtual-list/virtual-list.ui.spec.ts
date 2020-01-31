import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualListUi } from './virtual-list.ui';

describe('ListPageComponent', () => {
  let component: VirtualListUi;
  let fixture: ComponentFixture<VirtualListUi>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualListUi ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualListUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
