import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMembresias } from './lista-membresias';

describe('ListaMembresias', () => {
  let component: ListaMembresias;
  let fixture: ComponentFixture<ListaMembresias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMembresias],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaMembresias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
