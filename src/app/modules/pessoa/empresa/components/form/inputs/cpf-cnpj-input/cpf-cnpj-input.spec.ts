import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfCnpjInput } from './cpf-cnpj-input';

describe('CpfCnpjInput', () => {
  let component: CpfCnpjInput;
  let fixture: ComponentFixture<CpfCnpjInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpfCnpjInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CpfCnpjInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
