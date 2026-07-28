import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenus } from './role-menus';

describe('RoleMenus', () => {
  let component: RoleMenus;
  let fixture: ComponentFixture<RoleMenus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleMenus],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleMenus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
