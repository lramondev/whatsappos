// src/app/services/utils/file.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {

  readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('Nenhum arquivo fornecido'));

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  validateCertificateFile(file: File): { valid: boolean; error?: string } {
    if (!file) return { valid: false, error: 'Nenhum arquivo selecionado' };

    if (file.size > 2 * 1024 * 1024) {
      return { valid: false, error: 'Arquivo muito grande (máx. 2MB)' };
    }

    const ext = this.getFileExtension(file.name);
    if (!['pfx', 'p12'].includes(ext)) {
      return { valid: false, error: 'Apenas arquivos .pfx ou .p12 são permitidos' };
    }

    return { valid: true };
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  getFileInfo(file: File) {
    return {
      name: file.name,
      sizeKB: (file.size / 1024).toFixed(2) + ' KB',
      extension: this.getFileExtension(file.name)
    };
  }
}