import { computed, signal } from "@angular/core";

export class DataSelect {
  
  private _pageData = signal<any[]>([]);
  readonly pageData = this._pageData.asReadonly();

  private _selectedRows = signal<any[]>([]);
  readonly selectedRows = this._selectedRows.asReadonly();
  readonly selectedCount = computed(() => this._selectedRows().length);
  readonly allSelected = computed(() => this.pageData().length > 0 && this.pageData().every(row => this.isSelected(row)));

  toggleSelection(row: any) {
    if (this.isSelected(row)) {
      this._selectedRows.set(this._selectedRows().filter(r => r !== row));
    } else {
      this._selectedRows.set([...this._selectedRows(), row]);
    }
  }

  select(row: any) {
    this._selectedRows.set([...this._selectedRows(), row]);
  }

  desselect(row: any) {
    this._selectedRows.set(this._selectedRows().filter(r => r !== row));
  }

  toggleAll() {
    if (this.allSelected()) {
      this.clearSelection();
    } else {
      this._selectedRows.set([...this.pageData()]);
    }
  }

  selectAll() {
    this._selectedRows.set([...this.pageData()]);
  }

  isSelected(row: any): boolean {
    return this._selectedRows().includes(row);
  }

  clearSelection() {
    this._selectedRows.set([]);
  }
}