// src/app/services/domain/certificado.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { FileService } from '../utils/file.service';
import { SnackbarService } from '../utils/snackbar.service';
import { CertificatePasswordComponent } from '../../modules/shared/dialogs';

import * as forge from 'node-forge';

export interface Certificate {
  razao_social: string;
  cnpj: string;
  responsavel?: string | null;
  cpf_responsavel?: string | null;
  email?: string | null;
  cidade?: string | null;
  uf?: string | null;
  pais: string;
  validade_inicio: Date;
  validade_fim: Date;
  expira: number;
  valid: boolean;

  serial: string;
  file: ArrayBuffer;           // Arquivo original (.pfx)
  certificate: any;               // Objeto do forge (cert)
  key?: any;               // Chave privada (se precisar)
  name: string;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class CertificateService {

  constructor(
    private fileService: FileService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  async lerCertificado(file: File): Promise<Certificate> {
    if (!file) {
      this.snackbar.error('Nenhum arquivo selecionado');
      throw new Error('Nenhum arquivo selecionado');
    }

    const validation = this.fileService.validateCertificateFile(file);
    if (!validation.valid) {
      this.snackbar.error(validation.error!);
      throw new Error(validation.error);
    }

    let password: string | null = null;

    while (true) {
      password = await this.solicitarSenha();

      if (!password) {
        this.snackbar.error('Operação cancelada');
        throw new Error('Operação cancelada pelo usuário');
      }

      try {
        const arrayBuffer = await this.fileService.readAsArrayBuffer(file);
        const cert = this.parseAndExtractCert(arrayBuffer, password);
        return this.gerarInfo(cert, file, arrayBuffer);
      } catch (error: any) {
        if (error.message?.toLowerCase().includes('senha') || 
            error.message?.toLowerCase().includes('password')) {
          this.snackbar.error('Senha incorreta. Tente novamente.');
          continue; // tenta novamente
        }

        this.snackbar.error('Certificado inválido ou corrompido');
        throw error;
      }
    }
  }

  private async solicitarSenha(): Promise<string | null> {
    const dialogRef = this.dialog.open(CertificatePasswordComponent, {
      width: '420px',
      disableClose: true,
      hasBackdrop: false
    });

    return firstValueFrom(dialogRef.afterClosed());
  }

  private parseAndExtractCert(arrayBuffer: ArrayBuffer, senha: string): any {
    const bytes = forge.util.createBuffer(arrayBuffer);
    const asn1 = forge.asn1.fromDer(bytes.getBytes());
    const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, senha);

    const certBags = p12.getBags({ bagType: forge.pki.oids['certBag'] });
    const certBag = certBags[forge.pki.oids['certBag']]?.[0];

    if (!certBag?.cert) throw new Error('Certificado inválido');

    return certBag.cert;
  }

  private gerarInfo(cert: any, file: File, rawArrayBuffer: ArrayBuffer): Certificate {
    const cn = cert.subject.getField('CN')?.value || '';
    const [razaoSocial, cnpjRaw] = cn.includes(':') ? cn.split(':') : [cn, ''];

    const validadeFim = cert.validity.notAfter;
    const diasRestantes = this.calcularDiasRestantes(validadeFim);

    let responsavel = cert.subject.getField('OU')?.value;

    if (!responsavel || responsavel === 'VideoConferencia' || responsavel.includes('RFB')) {
      responsavel = this.extrairResponsavel(cert);
    }

    return {
      razao_social: razaoSocial.trim(),
      cnpj: this.formatarCNPJ(cnpjRaw.trim()),
      responsavel: responsavel || null,
      cpf_responsavel: this.extrairCpfResponsavel(cert),
      email: cert.subject.getField('E')?.value || null,
      cidade: cert.subject.getField('L')?.value || null,
      uf: cert.subject.getField('ST')?.value || null,
      pais: cert.subject.getField('C')?.value || 'BR',
      validade_inicio: cert.validity.notBefore,
      validade_fim: validadeFim,
      expira: diasRestantes,
      valid: diasRestantes > 0,

      serial: cert.serialNumber,
      file: rawArrayBuffer,
      certificate: cert,
      name: file.name,
      size: file.size
    };
  }

  private formatarCNPJ(cnpj: string): string {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.length === 14
      ? numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
      : cnpj || 'Não encontrado';
  }

  private extrairResponsavel(cert: any): string | null {
    if (cert.extensions) {
      for (const ext of cert.extensions) {
        if (ext.name === 'subjectAltName' && ext.altNames) {
          for (const alt of ext.altNames) {
            if (typeof alt.value === 'string') {
              const value = alt.value.trim();
              if (
                value.length > 10 &&
                value.includes(' ') &&
                /[A-ZÁÉÍÓÚÇÑ]/.test(value) &&
                !value.includes('@') &&
                !/^\d+$/.test(value) &&
                !value.includes('VideoConferencia') &&
                !value.includes('RFB') &&
                !value.includes('Secretaria')
              )
                return value;
            }
          }
        }
      }
    }

    if (cert.friendlyName) {
      const match = cert.friendlyName.match(/[A-ZÁÉÍÓÚÇÑ][A-Za-zÁÉÍÓÚÇÑ\s]+[A-ZÁÉÍÓÚÇÑ]/);
      if (match && match[0].length > 10)
        return match[0].trim();
    }
    return null;
  }

  /** Extrai CPF do responsável (quando presente) */
  private extrairCpfResponsavel(cert: any): string | null {
    if (cert.extensions) {
      for (const ext of cert.extensions) {
        if (ext.name === 'subjectAltName' && ext.altNames) {
          for (const alt of ext.altNames) {
            if (typeof alt.value === 'string') {
              const match = alt.value.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
              if (match) return match[0];
            }
          }
        }
      }
    }
    return null;
  }

  private calcularDiasRestantes(validadeFim: Date): number {
    const diff = validadeFim.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }
}