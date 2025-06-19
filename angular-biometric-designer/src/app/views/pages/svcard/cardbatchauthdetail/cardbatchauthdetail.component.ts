import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { auto } from '@popperjs/core';
import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SpinnerOverlayService } from 'src/app/services/spinneroverlay.service';
import { svCardService } from 'src/app/services/svcard.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { cardBatchReqDto } from 'src/app/shared/models/svcard/cardbatch.req';
import { dxDataGridColumn, ColumnCellTemplateData } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardbatchauthdetail',
  templateUrl: './cardbatchauthdetail.component.html',
  styleUrl: './cardbatchauthdetail.component.scss'
})
export class CardbatchauthdetailComponent implements OnInit {

  constructor(private buttonService: ButtonService, private router: Router, public notificationService: NotificationService,
    private renderer: Renderer2,
    private svcardservice: svCardService,
    private tokenService: TokenService,
    private router_p: ActivatedRoute,
    private spinnerOverlayService: SpinnerOverlayService,) { }
  //#region Khai báo biến
  @ViewChild(DataGridControlComponent) dataGridControlComponent: DataGridControlComponent;
  batchNo: string = '';
  branchCode: string = '';
  batchStat: string = '';
  batchStatText: string = 'Chưa gửi';
  user_auth: string = '';
  authClick: boolean = false;

  req: cardBatchReqDto = new cardBatchReqDto();
  length = 0;
  dataSource: any = {}; columns: Array<dxDataGridColumn | string> = [{
    dataField: 'cust_no',
    caption: 'Mã khách hàng',
    width: 120,
  }, {
    dataField: 'cust_name',
    caption: 'Tên khách hàng',
    width: 160,
  }, {
    dataField: 'gttt_no',
    caption: 'Số GTTT',
    width: 90
  },
  {
    dataField: 'cust_ac_no',
    caption: 'Số tài khoản',
    width: 130,
  },
  {
    dataField: 'card_type',
    caption: 'Thẻ chính/Phụ',
    width: 110,
  },
  {
    dataField: 'card_no',
    caption: 'Số thẻ',
    width: 190,
  },
  {
    dataField: 'type_trans',
    caption: 'Loại giao dịch',
    width: 100,
    cellTemplate: (container, cellInfo) => {

      container.textContent = cellInfo.data.type_trans === 'TM' ? 'Phát hành mới' : 'Phát hành lại';

    }
  },
  {
    dataField: 'address',
    caption: 'Địa chỉ',
    width: auto,
  },
  {
    dataField: 'auth_stat',
    caption: 'Trạng thái',
    width: 100,
    cellTemplate: (container, cellInfo) => {

      container.textContent = cellInfo.data.auth_stat === 'A' ? 'Đã duyệt' : 'Chưa duyệt';

    }
  },
  {
    dataField: 'error_text',
    caption: 'Lỗi',
    width: auto,
    cssClass: 'text-danger'
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
        this.DetailCard(cellInfo);
      });
      container.append(button);
    },
  }
  ];

  //#endregion

  ngOnInit(): void {

    this.updateButton(true, true);

    this.router_p.queryParams.subscribe(params => {
      if (params['id'] != null) {

        this.batchNo = params['id'];
        this.batchStat = params['auth'];
        this.branchCode = params['branchCode'];
        this.req.batchNo = this.batchNo;

        //this.updateAuthStatus(this.batchStat);
        this.loadDataDetail();
      }

    });
  }
  updateButton(arg0: boolean, arg1: boolean, text?: string) {
    this.buttonService.setDataButtonPage([

      { buttonCode: 'AUTH', buttonName: text ?? 'Gửi lô', disable: false, visibility: arg0 },
      { buttonCode: 'BACK', buttonName: 'Quay về', disable: false, visibility: arg1 },
    ]);
  }
  updateAuthStatus(auth: string): void {
    switch (auth) {
      case "A":
        this.batchStatText = "Đã gửi";
        this.updateButton(false, true);
        break;
      case "U":
        this.batchStatText = "Chưa gửi";
        break;
      case "C":
        this.batchStatText = "Huỷ";
        break;
      case "E":
        this.batchStatText = "Gửi lỗi";
        this.updateButton(true, true, 'Gửi lại lô');
        break;
      default:
        break;
    }
  }
  loadDataDetail() {

    this.req.batchNo = this.batchNo;
    this.req.branchCode = this.branchCode;
    this.loadData(this.req);

  }
  loadData(params: any) {
    console.log('request filter: ', params);
    this.svcardservice.AuthBatchListDetail(params).subscribe(
      (response: any) => {
        console.log(new Date() + "response11: ", response);
        this.length = response.lstData.totalItems;
        this.dataSource = response.lstData.items;
        this.user_auth = response.lstData.items[0].user_auth;
        this.updateAuthStatus(response.lstData.items[0].api_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  onClick(event: any) {

    if (event === 'AUTH')  // gui lo
    {
      this.GuiLoEvent();
    }
    if (event === 'BACK')  // gui lo
    {
      this.router.navigate([`${'/svcard/cardbatchauth-list'}`]);
    }
  }
  DetailCard(cellInfo: ColumnCellTemplateData<any, any>) {
    console.log('DetailCard:', cellInfo);
    if (cellInfo.data.type_trans === 'TM') {
      // ShowDialog('CardRelease.ASPX?ref_no=" + cellInfo.data.reference_no + "',800,900);
      this.router.navigate([`${'/svcard/cardnew-detail'.split('?')[0]}`], { queryParams: { id: cellInfo.data.id } });

    } else {

      if (cellInfo.data.type_trans === 'EVNT0122' || cellInfo.data.type_trans === 'EVNT6001') {
        // ShowDialog('CardRe-Register.ASPX?ref_no=" + cellInfo.data.reference_no + "',800,900);
        this.router.navigate([`${'/svcard/cardrenew-detail'.split('?')[0]}`], { queryParams: { id: cellInfo.data.id } });
      } else {
        // ShowDialog('CardRe-Register2.ASPX?ref_no=" + cellInfo.data.reference_no + "',800,900);
      }

    }
  }
  handleRowPreparedEvent(e: any) {
    if (e.rowType === 'data') {
      if (e.data.card_stat === '201' || e.data.error_text != null) {
        const rowElement = e.rowElement;
        rowElement.style.color = '#e71616';
        rowElement.classList.add('custom-row-class');
      } else {
        if (this.authClick) {
          const rowElement = e.rowElement;
          rowElement.style.color = '#0e14ff';
          rowElement.classList.add('custom-row-class');
        }
      }
    }

  }
  GuiLoEvent() {

    //this.spinnerOverlayService.setLoadingHandmade(true);

    // if (element.card_stat === '202' || element.card_stat === '201') {
    //   this.authClick = true;

    //   if (element.type_trans === 'TM') {
    //     //DangKyMoi(ref success, row, ulti_sv);
    //     this.updateTess(element, '202', null);

    //   } else {
    //     // DangKyLai(ref success, row, ulti_sv);
    //      this.updateTess(element, '202', null);
    //   }

    // }

    let req: any = {
      branchCode: '',//cellInfo.data.branch_code,
      batchNum: this.batchNo//cellInfo.data.batch_num
    }
    this.svcardservice.AuthBatchListSendBatch(req).subscribe(
      data => {
        if (data.resCode === '000')
          this.notificationService.alertSussess(data.resDesc);
        else
          this.notificationService.alertError(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );



    this.dataGridControlComponent.reloadGrid(this.req);


    //this.spinnerOverlayService.setLoadingHandmade(false);

  }

}
