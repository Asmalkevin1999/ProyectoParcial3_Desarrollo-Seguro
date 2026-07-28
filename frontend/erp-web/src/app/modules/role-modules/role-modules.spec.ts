import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModules } from './role-modules';

describe('RoleModules', () => {
  let component: RoleModules;
  let fixture: ComponentFixture<RoleModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleModules],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleModules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
