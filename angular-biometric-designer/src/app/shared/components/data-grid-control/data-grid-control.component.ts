import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginatorGotoModule } from '../mat-paginator-goto/mat-paginator-goto.component';
import { DxBulletModule, DxDataGridComponent, DxDataGridModule, DxLoadPanelModule, DxTemplateModule } from 'devextreme-angular';
//import DevExpress from 'devextreme';
import { PageEvent } from '@angular/material/paginator';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';

@Component({
  selector: 'app-data-grid-control',
  templateUrl: './data-grid-control.component.html',
  styleUrls: ['./data-grid-control.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DataGridControlComponent implements OnInit, OnChanges {
  //@Input() columns: Array<DevExpress.ui.dxDataGridColumn | string> = [];
  @Input() columns: Array<dxDataGridColumn | string> = [];
  @Input() dataSource: any = {};
  @Input() requestFilter: any = {};
  @Input() length = 0;
  @Input() selectAllMode = 'page';
  @Input() mode = 'multiple';
  @Input() showCheckBoxesMode = 'none';
  @Input() keyExpr = '';
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Output() loadData = new EventEmitter<any>();
  @Output() onRowPreparedEventEmit = new EventEmitter<any>();
  @Output() onSelectionChanged = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();

  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  public customDataSource: CustomStore;

  public collapsed = false;
  public queryParam: string = '';
  public selectedRows: any[] = [];

  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;

  public pageEvent: PageEvent;

  constructor() {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.customDataSource = new CustomStore({
      // key: this.keyExpr,
      load: (loadOptions: any) => {
        console.log('loadOptions', loadOptions);
        if (loadOptions != null && loadOptions.length > 0) {
          const { skip, take } = loadOptions;
          this.pageIndex = skip / take;
          this.pageSize = take;
        }
        return Promise.resolve({
          data: this.dataSource,
          totalCount: this.length
        });
      }
    });
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.dataGrid.instance.dispose();
  }
  contentReady(event: any) {
    if (!this.collapsed) {
      this.collapsed = true;
      // this.buildQueryParam();
      this.loadData.emit(this.requestFilter);
      if (this.collapsed) {
        this.dataGrid.instance.refresh();
      }
      console.log('contentReady finished');
    }

    //Xóa khoảng trắng thừa trên bảng 
    document.querySelectorAll('.dx-freespace-row').forEach(row => row.remove());
  }
  onPageIndexChanged(e: any) {
    console.log('Page changed to: ', e);
    this.pageIndex = e;
    // this.buildQueryParam();
    this.requestFilter.pageindex = this.pageIndex + 1;
    this.requestFilter.pagesize = this.pageSize;
    this.loadData.emit(this.requestFilter);
    if (this.collapsed) {
      this.dataGrid.instance.refresh();
    }
  }
  selectionChanged(event: any): void {
    this.onSelectionChanged.emit(event);
  }

  handleRowClick(event: any) {
    this.onRowClick.emit(event);
  }

  getRowHeight(): number {
    const rowElement = document.querySelector('.dx-header-row');
    console.log('OOOOO: ', rowElement)
    return rowElement ? rowElement.clientHeight : 0;
  }

  getRowCount(): number {
    const rows = document.querySelectorAll('.dx-data-row');
    console.log('OOOOO: ', rows.length)
    return rows.length;
  }
  // handlePageEvent(e: PageEvent) {
  //   this.pageEvent = e;
  //   this.length = e.length;
  //   this.pageSize = e.pageSize;
  //   this.pageIndex = e.pageIndex;
  //   console.log("onPaginationChangedEvent ", e);
  //   console.log('paginationGetCurrentPage' + e.pageIndex);
  //   this.buildQueryParam();
  //   this.loadData.emit(this.queryParam);
  //   if (this.collapsed) {
  //     this.dataGrid.instance.refresh();
  //   }
  // }
  // buildQueryParam() {
  //   var index: number = 1 + this.pageIndex;
  //   var skipCount = this.pageIndex * this.pageSize;
  //   this.queryParam = "?SkipCount=" + skipCount + "&MaxResultCount=" + this.pageSize;
  //   this.buildParamsUrl(this.requestFilter);
  // }
  // buildParamsUrl(obj: any) {
  //   if (obj) {
  //     const objectKeys = Object.keys(obj);
  //     if (objectKeys != null && objectKeys.length > 0) {
  //       objectKeys.forEach((item: any) => {
  //         if (item != null && item != '' && obj[item] != null && obj[item] != '') {
  //           if (this.queryParam == null || this.queryParam == '') {
  //             this.buildQueryParam();
  //           }
  //           this.queryParam += '&' + item + '=' + obj[item];
  //         }
  //       });
  //     }
  //   }
  // }
  // buildParamsUrl2(obj: any) {
  //   if (obj) {
  //     this.queryParam = '';
  //     const objectKeys = Object.keys(obj);
  //     if (objectKeys != null && objectKeys.length > 0) {
  //       objectKeys.forEach((item: any) => {
  //         if (item != null && item != '' && obj[item] != null && obj[item] != '') {
  //           if (this.queryParam == null || this.queryParam == '') {
  //             this.queryParam = '?';
  //           }
  //           this.queryParam += item + '=' + obj[item] + '&';
  //         }
  //       });
  //     }
  //   }
  // }
  reloadGrid(req: any) {
    // req = {};
    this.selectedRows = [];
    this.requestFilter = req;
    if (this.pageIndex != 0) {
      this.pageIndex = 0;
    }
    else {
      // this.buildQueryParam();
      this.loadData.emit(this.requestFilter);
    }
    if (this.collapsed) {
      this.dataGrid.instance.refresh();
    }
  }
  reloadCurrentPage(req: any) {
    this.requestFilter = req;
    // this.buildQueryParam();
    this.loadData.emit(this.requestFilter);
    if (this.collapsed) {
      this.dataGrid.instance.refresh();
    }
  }
  searchGrid(req: any) {
    this.selectedRows = [];
    this.requestFilter = req;
    // var skipCount = this.pageIndex * this.pageSize;
    // this.queryParam = "?SkipCount=" + skipCount + "&MaxResultCount=" + this.pageSize;
    // console.log('queryDefault: ', this.queryParam);
    // this.buildParamsUrl(req);
    if (this.pageIndex != 0) {
      this.pageIndex = 0;
    }
    else {
      // this.buildQueryParam();
      this.requestFilter.pageindex = this.pageIndex + 1;
      this.requestFilter.pagesize = this.pageSize;
      this.loadData.emit(this.requestFilter);
    }
    if (this.collapsed) {
      this.dataGrid.instance.refresh();
    }
  }
  onRowPreparedEvent(e: any) {
    if (e.rowType === 'data') {
      const rowElement = e.rowElement;

      // Xóa handler cũ nếu có (tránh đăng ký nhiều lần)
      rowElement.removeEventListener('mouseenter', rowElement._hoverEnterHandler);
      rowElement.removeEventListener('mouseleave', rowElement._hoverLeaveHandler);

      // Tạo handler mới
      const enterHandler = () => {
        rowElement.classList.add('hover-active');

        // Tìm dòng tương ứng trong bảng fixed columns (nếu có)
        const fixedTable = rowElement.closest('.dx-datagrid-rowsview')
          ?.querySelector('.dx-fixed-columns tbody');
        if (fixedTable) {
          const fixedRow = fixedTable.querySelectorAll('tr')[e.rowIndex];
          fixedRow?.classList.add('hover-active');
        }
      };

      const leaveHandler = () => {
        rowElement.classList.remove('hover-active');

        const fixedTable = rowElement.closest('.dx-datagrid-rowsview')
          ?.querySelector('.dx-fixed-columns tbody');
        if (fixedTable) {
          const fixedRow = fixedTable.querySelectorAll('tr')[e.rowIndex];
          fixedRow?.classList.remove('hover-active');
        }
      };

      // Gắn và lưu lại handler để tránh trùng lặp
      rowElement._hoverEnterHandler = enterHandler;
      rowElement._hoverLeaveHandler = leaveHandler;

      rowElement.addEventListener('mouseenter', enterHandler);
      rowElement.addEventListener('mouseleave', leaveHandler);

      this.onRowPreparedEventEmit.emit(e);
    }
  }
  reloadGridLocal() {
    this.dataGrid.instance.refresh();
  }
  goToPage(requestFilter: any) {

    this.requestFilter = requestFilter
    this.pageIndex = this.requestFilter.pageindex - 1;
    // this.buildQueryParam();
    this.requestFilter.pageindex = this.pageIndex + 1;
    this.requestFilter.pagesize = this.pageSize;
    this.loadData.emit(this.requestFilter);
    if (this.collapsed) {
      this.dataGrid.instance.refresh();
    }
  }
}
@NgModule({
  declarations: [DataGridControlComponent],
  exports: [
    DataGridControlComponent,
  ],
  imports: [
    MatPaginatorGotoModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    DxLoadPanelModule]
})

export class DataGridControlModule { }