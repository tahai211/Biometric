import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { InboxService } from 'src/app/services/inbox.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TabStateService } from 'src/app/services/tab.state.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { TransactionReq } from 'src/app/shared/models/inbox/transaction.req';
import { VerificationReq } from 'src/app/shared/models/inbox/verification.req';
import { PageDto } from 'src/app/shared/models/page.dto';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  @ViewChild(DataGridControlComponent) dataGridControlComponent1: DataGridControlComponent;
  @ViewChild(DataGridControlComponent) dataGridControlComponent2: DataGridControlComponent;
  titleHeader: string = 'Yêu cầu tra soát';
  countRequestVerification: any = '0';
  countPendingTransaction: any = '0';
  countTransactionCompleted: any = '0';
  countTransactionDeclined: any = '0';
  countTransactionCancelled: any = '0';
  countTransactionWaitingCreate: any = '0';
  currentTable: string = 'table1';
  req_table1: VerificationReq = new VerificationReq();
  dataSource_table1: any = [];
  length_table1 = 0;
  req_table2: TransactionReq = new TransactionReq();
  dataSource_table2: any = [];
  length_table2 = 0;
  id_search: string = '';
  description_search: string = '';
  from_date_search: string = '';
  to_date_search: string = '';
  titleIdSearch: string = 'Mã tra soát';

  @ViewChild('dateBox') dateBoxComponent: any;

  openCalendar() {
    this.dateBoxComponent?.instance?.open();
  }

  columns_table1: Array<dxDataGridColumn | string> = [
    {
      dataField: 'issue_id',
      caption: 'Mã tra soát',
    },
    {
      dataField: 'description',
      caption: 'Diễn giải',
    },
    {
      dataField: 'status',
      caption: 'Trạng thái',
    },
    {
      dataField: 'created_by',
      caption: 'Người tạo',
    },
    {
      dataField: 'created_date',
      caption: 'Ngày tạo',
    },
    {
      dataField: 'response_by',
      caption: 'Người phản hồi',
    },
    {
      dataField: 'response_date',
      caption: 'Ngày giờ phản hồi',
    },
    {
      fixed: true,
      width: auto,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        const button = this.renderer.createElement('button');
        const img = this.renderer.createElement('img');

        this.renderer.addClass(button, 'btn');
        this.renderer.addClass(button, 'btn-sm');
        this.renderer.addClass(button, 'btn-icon');

        this.renderer.setAttribute(img, 'src', 'assets/images/icon/detail.svg');
        this.renderer.setStyle(img, 'width', '18px');
        this.renderer.setStyle(img, 'height', '18px');

        this.renderer.appendChild(button, img);
        this.renderer.listen(button, 'click', () => {
          this.requestVerificationDetail(cellInfo.data);
        });
        container.append(button);
      },
    }
  ];

  showApprovedByColumn: boolean = true;
  columns_table2: Array<dxDataGridColumn | string> = [
    {
      dataField: 'trn_ref_no',
      caption: 'Mã',
    },
    {
      dataField: 'description',
      caption: 'Diễn giải',
    },
    {
      dataField: 'created_by',
      caption: 'Người tạo',
    },
    ...(this.showApprovedByColumn ?
      [{
        dataField: 'approved_by',
        caption: 'Người duyệt',
      }] : []),
    {
      dataField: 'auth_stat',
      caption: 'Trạng thái',
    },
    {
      dataField: 'created_date',
      caption: 'Ngày tạo',
    },
    {
      fixed: true,
      width: auto,
      alignment: 'center',
      cellTemplate: (container, cellInfo) => {
        const button = this.renderer.createElement('button');
        const img = this.renderer.createElement('img');

        this.renderer.addClass(button, 'btn');
        this.renderer.addClass(button, 'btn-sm');
        this.renderer.addClass(button, 'btn-icon');
        this.renderer.setAttribute(img, 'src', 'assets/images/icon/detail.svg');
        this.renderer.setStyle(img, 'width', '18px');
        this.renderer.setStyle(img, 'height', '18px');

        this.renderer.appendChild(button, img);
        this.renderer.listen(button, 'click', () => {
          this.transactionDetail(cellInfo.data);
        });
        container.append(button);
      },
    }
  ];

  constructor(
    private inboxService: InboxService,
    private renderer: Renderer2,
    private router: Router,
    private tabStateService: TabStateService
  ) { }

  ngOnInit() {
    this.loadFilter();

    this.loadScreen();
  }

  loadScreen() {
    if (this.tabStateService.selectedTabTitle != '') {
      this.titleHeader = this.tabStateService.selectedTabTitle;

      if (this.titleHeader == 'Yêu cầu tra soát') {
        this.switchTable('RequestVerification')
      }
      else if (this.titleHeader == 'Giao dịch chờ xử lý') {
        this.switchTable('PendingTransaction')
      }
      else if (this.titleHeader == 'Giao dịch hoàn thành') {
        this.switchTable('TransactionCompleted')
      }
      else if (this.titleHeader == 'Giao dịch bị từ chối') {
        this.switchTable('TransactionDeclined')
      }
      else if (this.titleHeader == 'Giao dịch bị hủy') {
        this.switchTable('TransactionCancelled')
      }
      else if (this.titleHeader == 'Giao dịch chờ tạo') {
        this.switchTable('TransactionWaitingCreate')
      }
    }
  }

  loadFilter() {
    this.inboxService.getInboxFilter({}).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.countRequestVerification = response.countRequestVerification == null ? '0' : response.countRequestVerification;
        this.countPendingTransaction = response.countPendingTransaction == null ? '0' : response.countPendingTransaction;
        this.countTransactionCompleted = response.countTransactionCompleted == null ? '0' : response.countTransactionCompleted;
        this.countTransactionDeclined = response.countTransactionDeclined == null ? '0' : response.countTransactionDeclined;
        this.countTransactionCancelled = response.countTransactionCancelled == null ? '0' : response.countTransactionCancelled;
        this.countTransactionWaitingCreate = response.countTransactionWaitingCreate == null ? '0' : response.countTransactionWaitingCreate;
      },
      err => {
        console.log(new Date(), err);
      }
    )
  }

  switchTable(buttonName: string) {
    this.id_search = '';
    this.description_search = '';
    this.from_date_search = '';
    this.to_date_search = '';

    if (buttonName == 'RequestVerification') {
      this.titleHeader = 'Yêu cầu tra soát'
      this.currentTable = 'table1';
      this.titleIdSearch = 'Mã tra soát';
    }
    else if (buttonName == 'PendingTransaction') {
      this.titleHeader = 'Giao dịch chờ xử lý'
      this.showApprovedByColumn = true;
      this.currentTable = 'table2';
      this.titleIdSearch = 'Mã';
      this.updateColumnTable2(buttonName);

      this.req_table2.type_inbox = '0'; //Giao dịch chờ xử lý
      this.req_table2.pageindex = 1;
      this.req_table2.pagesize = 10;
      this.dataGridControlComponent2.pageIndex = 0;
      this.loadData_table2(this.req_table2);
    }
    else if (buttonName == 'TransactionCompleted') {
      this.titleHeader = 'Giao dịch hoàn thành'
      this.showApprovedByColumn = true;
      this.currentTable = 'table2';
      this.titleIdSearch = 'Mã';
      this.updateColumnTable2(buttonName);

      this.req_table2.type_inbox = '1'; //Giao dịch hoàn thành
      this.req_table2.pageindex = 1;
      this.req_table2.pagesize = 10;
      this.dataGridControlComponent2.pageIndex = 0;
      this.loadData_table2(this.req_table2);
    }
    else if (buttonName == 'TransactionDeclined') {
      this.titleHeader = 'Giao dịch bị từ chối'
      this.showApprovedByColumn = true;
      this.currentTable = 'table2';
      this.titleIdSearch = 'Mã';
      this.updateColumnTable2(buttonName);

      this.req_table2.type_inbox = '2'; //Giao dịch bị từ chối
      this.req_table2.pageindex = 1;
      this.req_table2.pagesize = 10;
      this.dataGridControlComponent2.pageIndex = 0;
      this.loadData_table2(this.req_table2);
    }
    else if (buttonName == 'TransactionCancelled') {
      this.titleHeader = 'Giao dịch bị hủy'
      this.showApprovedByColumn = true;
      this.currentTable = 'table2';
      this.titleIdSearch = 'Mã';
      this.updateColumnTable2(buttonName);

      this.req_table2.type_inbox = '3'; //Giao dịch bị hủy
      this.req_table2.pageindex = 1;
      this.req_table2.pagesize = 10;
      this.dataGridControlComponent2.pageIndex = 0;
      this.loadData_table2(this.req_table2);
    }
    else if (buttonName == 'TransactionWaitingCreate') {
      this.titleHeader = 'Giao dịch chờ tạo'
      this.showApprovedByColumn = false;
      this.currentTable = 'table2';
      this.titleIdSearch = 'Mã hồ sơ RLOS';
      this.updateColumnTable2(buttonName);

      this.req_table2.type_inbox = '4'; //Giao dịch chờ tạo
      this.req_table2.pageindex = 1;
      this.req_table2.pagesize = 10;
      this.dataGridControlComponent2.pageIndex = 0;
      this.loadData_table2(this.req_table2);
    }
  }

  updateColumnTable2(buttonName: string) {
    this.columns_table2 = [
      {
        dataField: 'trn_ref_no',
        caption: buttonName === 'TransactionWaitingCreate' ? 'Mã hồ sơ RLOS' : 'Mã',
      },
      {
        dataField: 'description',
        caption: 'Diễn giải',
      },
      {
        dataField: 'created_by',
        caption: 'Người tạo',
      },
      ...(this.showApprovedByColumn ?
        [{
          dataField: 'approved_by',
          caption: 'Người duyệt',
        }] : []),
      {
        dataField: 'auth_stat',
        caption: 'Trạng thái',
      },
      {
        dataField: 'created_date',
        caption: 'Ngày tạo',
      },
      {
        fixed: true,
        width: auto,
        alignment: 'center',
        cellTemplate: (container, cellInfo) => {
          const button = this.renderer.createElement('button');
          const img = this.renderer.createElement('img');

          this.renderer.addClass(button, 'btn');
          this.renderer.addClass(button, 'btn-sm');
          this.renderer.addClass(button, 'btn-icon');

          this.renderer.setAttribute(img, 'src', 'assets/images/icon/detail.svg');
          this.renderer.setStyle(img, 'width', '18px');
          this.renderer.setStyle(img, 'height', '18px');

          this.renderer.appendChild(button, img);
          this.renderer.listen(button, 'click', () => {
            this.transactionDetail(cellInfo.data);
          });
          container.append(button);
        },
      }
    ]
  }

  loadData_table1(params: any) {
    params.id_issue = this.id_search.trim();
    params.description = this.description_search.trim();
    params.from_date = this.from_date_search.trim();
    params.to_date = this.to_date_search.trim();

    this.inboxService.getRequestVerification(params).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.length_table1 = response.lstData.totalItems;
        this.dataSource_table1 = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }

  loadData_table2(params: any) {
    params.trn_ref_no = this.id_search.trim();
    params.description = this.description_search.trim();
    params.from_date = this.from_date_search.trim();
    params.to_date = this.to_date_search.trim();

    console.log("req table2: ", params);

    this.inboxService.getTransactionInbox(params).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.length_table2 = response.lstData.totalItems;
        this.dataSource_table2 = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);

        this.length_table2 = 0;
        this.dataSource_table2 = [];
      }
    )
  }

  requestVerificationDetail(verification: any) {
    this.tabStateService.selectedTabTitle = this.titleHeader;
    this.router.navigate([`/helpdesk/review-response-new`], { queryParams: { issueid: verification.issue_id } });
  }

  transactionDetail(transaction: any) {
    console.log('cellinfo: ', transaction)

    this.tabStateService.selectedTabTitle = this.titleHeader;

    switch (transaction.product_code.toUpperCase()) {
      case 'AC':
        if (transaction.event_code == 'FLIQ') {

        }
        else if (transaction.event_code == 'AC') {

        }
        break;

      case 'CI':

        break;

      case 'TM':
        this.router.navigate([`/svcard/cardnew-detail`], { queryParams: { id: transaction.id } });
        break;
      case 'TM-PHTTL':

        break;

      case 'GHT':
        const card_type = transaction.card_category == 'C' ? "credit" : "debit";
        if (transaction.service == '302') {
          this.router.navigate([`/svcard/cardrenew-detail`], { queryParams: { id: transaction.id, type: card_type } });
        } else {
          this.router.navigate([`/svcard/cardrenewextend-detail`], { queryParams: { id: transaction.id, type: card_type } });
        }
        break;

      case 'CLT':

        break;

      case 'TK':
        this.router.navigate([`/cardmanage/approve-handover-card-customer`], { queryParams: { card_number: transaction.trn_ref_no } });
        break;

      case 'HD': //helpdesk

        break;

      case 'NT': //helpdesk

        break;

      case 'SMS':

        break;

      case 'TDTK':
        this.router.navigate([`/svcard/changeaccountcard`], { queryParams: { id: transaction.id } });
        break;
        break;
    }
  }

  search() {
    if (this.currentTable == 'table1') {
      this.dataGridControlComponent1.searchGrid(this.req_table1)
    }
    else {
      this.dataGridControlComponent2.searchGrid(this.req_table2)
    }
  }

  reload() {
    this.id_search = '';
    this.description_search = '';
    this.from_date_search = '';
    this.to_date_search = '';

    if (this.currentTable == 'table1') {
      this.req_table1.pageindex = 1;
      this.req_table1.description = "";
      this.req_table1.from_date = "";
      this.req_table1.to_date = "";
      this.req_table1.id_issue = "";

      this.dataGridControlComponent1.searchGrid(this.req_table1)
    }
    else {
      this.req_table2.pageindex = 1;
      this.req_table2.description = "";
      this.req_table2.from_date = "";
      this.req_table2.to_date = "";
      this.req_table2.trn_ref_no = "";

      this.dataGridControlComponent2.searchGrid(this.req_table2)
    }
  }
};