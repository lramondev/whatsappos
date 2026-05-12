import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatePassword } from './certificate-password';

describe('CertificatePassword', () => {
  let component: CertificatePassword;
  let fixture: ComponentFixture<CertificatePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatePassword],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificatePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
