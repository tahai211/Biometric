import { Component, Input, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { TransactionNewReq } from 'src/app/shared/models/helpdesk/transaction.new.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.scss'
})
export class TransactionDetailComponent {
  @Input() card_number: string = '';
  @Input() account_number: string = '';
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  req: TransactionNewReq = new TransactionNewReq();
  length = 0;
  dataSource: any = [];

  columns: Array<dxDataGridColumn | string> = [
    {
      dataField: '',
      caption: 'STT',
      width: 50
    },
    {
      dataField: 'transactionDescription',
      caption: 'Loại giao dịch',
    },
    {
      dataField: 'accountNumber',
      caption: 'Số tài khoản',
    },
    {
      dataField: 'authorizationDate',
      caption: 'Ngày giao dịch',
    },
    {
      dataField: 'amount',
      caption: 'Số tiền',
    },
    {
      dataField: '',
      caption: 'DVT',
    },
    {
      dataField: 'operationDirection',
      caption: 'Nợ/Có',
    },
    {
      dataField: 'terminalId',
      caption: 'TID',
    },
    {
      dataField: 'issuerInstitutionId',
      caption: 'Đơn vị',
    },
    {
      dataField: 'utrnno',
      caption: 'Số Trace',
    },
    {
      dataField: 'transactionType',
      caption: 'Loại giao dịch HIDDEN',
    }
  ];

  constructor(
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.req.card_number = this.card_number;
  }

  loadData(params: any) {
    console.log("req: ", this.req)

    this.helpdeskService.searchTransactionNew(this.req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.dataSource = response.lstData.items;
      },
      err => {
        console.log(new Date(), err);
      }
    );
  }

  Search() {
    this.dataGridControlComponent.reloadGrid(this.req);
  }

  Print() {

  }
}
