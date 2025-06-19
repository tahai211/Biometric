import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginatorGotoModule } from '../mat-paginator-goto/mat-paginator-goto.component';
import { DxBulletModule, DxDataGridComponent, DxDataGridModule, DxLoadPanelModule, DxTemplateModule } from 'devextreme-angular';
// import DevExpress from 'devextreme';
import { PageEvent } from '@angular/material/paginator';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-data-grid-control-mini',
  templateUrl: './data-grid-control-mini.component.html',
  styleUrls: ['./data-grid-control-mini.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataGridControlMiniComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() columns: Array<dxDataGridColumn | string> = [];
  @Input() dataSource: any = {};
  @Input() requestFilter: any = {};
  @Input() length = 0;
  @Input() selectAllMode = 'allPages';
  @Input() selectMode = 'multiple';
  @Input() showCheckBoxesMode = 'none';
  @Input() keyExpr = '';
  @Input() enabledPaging = true;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() disabled: boolean = false;
  @Output() loadData = new EventEmitter<any>();
  @Output() onSelectionChanged = new EventEmitter<any>();
  @Output() oncellPrepared = new EventEmitter<any>();
  @ViewChild('dataGridMini', { static: false }) dataGrid: DxDataGridComponent;

  public collapsed = false;
  public queryParam: string = '';
  public selectedRows: any[] = [];
  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.applyDisabledState();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled && this.dataGrid && this.dataGrid.instance) {
      this.applyDisabledState();
    }
  }

  ngOnDestroy(): void {
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.dispose();
    }
  }

  private applyDisabledState(): void {
    if (this.dataGrid && this.dataGrid.instance) {
      this.dataGrid.instance.option('disabled', this.disabled);
      
      // Optionally refresh the grid to apply changes
      setTimeout(() => {
        this.dataGrid.instance.refresh();
      }, 0);
    }
  }

  contentReady(event: any): void {
    if (!this.collapsed) {
      this.collapsed = true;
      this.loadData.emit(this.requestFilter);
      if (this.collapsed) {
        this.dataGrid.instance.refresh();
      }
      console.log('contentReady finished');
    }
  }

  selectionChanged(event: any): void {
    this.onSelectionChanged.emit(event);
  }

  cellPrepared(event: any): void {
    this.oncellPrepared.emit(event);
  }

  onRowPreparedEvent(e: any) {
    if (e.rowType === 'data') {
      e.rowElement.classList.add('hover-row');
    }
  }
}

@NgModule({
  declarations: [DataGridControlMiniComponent],
  exports: [DataGridControlMiniComponent],
  imports: [
    MatPaginatorGotoModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    DxLoadPanelModule
  ]
})
export class DataGridControlMiniModule { }