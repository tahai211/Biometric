
import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CBSService } from 'src/app/services/cbs.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { svCardService } from 'src/app/services/svcard.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CONST } from 'src/app/shared/const/const';
import { CardInfoDto } from 'src/app/shared/models/svcard/cardinfo.dto';
import { CardNewDto } from 'src/app/shared/models/svcard/cardnew.dto';
import { CardOfCtmReq } from 'src/app/shared/models/svcard/cardofctm.req';
import { CustomerListReq } from 'src/app/shared/models/svcard/customerlist.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
@Component({
  selector: 'app-changeaccountcard',
  templateUrl: './changeaccountcard.component.html',
  styleUrl: './changeaccountcard.component.scss'
})
export class ChangeaccountcardComponent implements OnInit {
  @ViewChild('dataGridCust') dataGridCust: DataGridControlComponent;
  @ViewChild('dataGridAcc') dataGridAcc: DataGridControlMiniComponent;
  id: string = '';
  rlosId: string = '';
  reqListCust: CardOfCtmReq = new CardOfCtmReq();
  lengthCust = 0;
  dataSourceCust: any = {};
  dataSourceAcc: any = {};
  disableApprove: boolean = false;
  columnsCust: Array<dxDataGridColumn | string> = [{
    dataField: 'branchCode',
    caption: 'Mã CN',
    width: 100
  }, {
    dataField: 'customerId',
    caption: 'Mã KH',
    width: 150
  }, {
    dataField: 'cardNo',
    caption: 'Số thẻ',
    width: 150
  }, {
    dataField: 'customerName',
    caption: 'Tên khách hàng',
    width: 230
  }, {
    dataField: 'identityNo',
    caption: 'Số CMNN',
    width: 150,
  }, {
    dataField: 'birthDay',
    caption: 'Ngày sinh',
    width: 150
  }];
  columnsAcc: Array<dxDataGridColumn | string> = [{
    dataField: 'accountNo',
    caption: 'Số tài khoản',
    width: '*'
  }, {
    dataField: 'branch_code',
    caption: 'Chi nhánh',
    width: '*',
    // cellTemplate: (container, cellInfo) => {
    //   container.textContent = cellInfo.data.branch_code + ' - ' + cellInfo.data.branch_name;
    // }
  }, {
    dataField: '',
    caption: 'Trạng thái',
    width: '*',
    cellTemplate: (container, cellInfo) => {
      container.textContent = "Mở";
    }
  }, {
    fixed: true,
    width: auto,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      // Kiểm tra checkbox có được chọn không
      const checked = this.accountSelected === cellInfo.data.accountNo;

      // Tạo checkbox
      const checkbox = this.renderer.createElement('input');
      this.renderer.setAttribute(checkbox, 'type', 'checkbox');
      this.renderer.setProperty(checkbox, 'checked', checked);

      // Thêm sự kiện click để toggle checkbox khi click vào checkbox hoặc row
      const toggleCheckbox = () => {
        this.accountSelected = cellInfo.data.accountNo;
        checkbox.checked = true; // Chỉ chọn 1 checkbox
        //this.refreshGrid(); // Cập nhật lại grid nếu cần
      };

      this.renderer.listen(checkbox, 'click', toggleCheckbox);
      this.renderer.listen(container, 'click', toggleCheckbox);

      container.appendChild(checkbox);
    },
  }];
  accountSelected: any = '';
  data: CardInfoDto = new CardInfoDto();
  dataCardType: any[] = CONST.dataCardType;
  dataBranchs: any[] = [];
  dataProducts: any[] = [];
  dataUserAuths: any[] = [];
  dataCountrys: any[] = [];
  dataCitys: any[] = [];

  isSelectedCard: boolean = false;
  isDisplayFooterButton: boolean = true;

  constructor(
    public svcardService: svCardService,
    public cbsService: CBSService,
    public notificationService: NotificationService,
    private renderer: Renderer2,
    private commonService: CommonService,
    private buttonService: ButtonService,
    private router: ActivatedRoute,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      if (params['id'] != null) {
        this.id = params['id'];
      }
    });

    if (this.id != null && this.id != '') {
      this.isSelectedCard = true;
    }
    else {
      this.isSelectedCard = false;
    }

    this.reqListCust.isChangeAccount = true;
    let data = this.tokenService.getInfomationFromLocalStorage();
    this.data.branch_code = data.branhcode;
    this.data.country_code = "704";
    this.data.city_code = "HNI";
    this.data.card_type = "TC";
    // if (this.rlosId != null && this.rlosId != '')
    //   this.loadDataRlosDetail();
    // else
    //is active

    this.loadDataDetail();
    //this.setButtons(true, false, false, false);
  }

  loadDataDetail() {
    var req = {
      id: this.id
    };
    
    this.svcardService.getCardReissuanceAccDetail(req).subscribe(
      (res: any) => {
        console.log("loadDataDetail");
        this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataProducts = res.products;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataCitys = res.citys;

        this.loadButton(res.data.auth_stat);
        this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', res.data.auth_stat);
        this.data.reference_no = res.data.reference_no;

        this.data = res.data;
        this.dataSourceAcc = res.custAcc;
        this.accountSelected = res.data.accountNew;
        this.dataGridAcc.dataGrid.instance.refresh();
        this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.customerType);
        let data = this.tokenService.getInfomationFromLocalStorage();
        this.data.branch_code = data.branhcode;
        this.data.country_code = "704";
        this.data.city_code = "HNI";
        this.data.card_type = "TC";
        this.data.cust_no = res.data.customerId;
        this.data.cust_name = res.data.customerName;
        this.data.unique_id_value = res.data.identityNo;
        this.data.birth_day = res.data.birthDate;
        this.data.card_name = res.data.cardName;
        this.data.card_name_sub = res.data.cardName;
        this.data.user_branch = res.data.account_branch;
        this.data.address_1 = res.data.address1;
        this.data.address_2 = res.data.address2;
        this.data.address_3 = res.data.address3;
        this.data.address_4 = res.data.address4;
        this.data.cust_mobile = res.data.phoneMobile;
        this.data.cust_phone = res.data.phoneHome;
        this.data.product_code = res.data.product;
        this.data.account_no = res.data.accountNo;
        this.data.card_no = res.data.cardNo;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  setButtons(isSave: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean, isBack: boolean,
              positionSave: string = 'right', positionBack: string = 'right', positionAuth: string = 'right',
              positionReject: string = 'right', positionCancel: string = 'right'
  ) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave, position: positionSave },
      { buttonCode: 'AUTH', buttonName: '', disable: false, visibility: isAuth, position: positionAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false, visibility: isReject, position: positionReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false, visibility: isCancel, position: positionCancel },
      { buttonCode: 'BACK', buttonName: '', disable: false, visibility: isBack, position: positionBack },
    ]);
  }
  loadButton(auth_stat: string) {
    if (auth_stat === 'C') {
      this.setButtons(false, false, false, false, false);
      this.isDisplayFooterButton = false;
    }
    else if (auth_stat === 'U') { 
      this.setButtons(false, true, true, false, false); 
      this.disableApprove = true;
      this.isDisplayFooterButton = true; 
    }
    else if (auth_stat === 'R') { 
      this.setButtons(false, false, false, true, false); 
      this.disableApprove = true;
      this.isDisplayFooterButton = true; 
    }
    else if (auth_stat === 'A') { 
      this.setButtons(false, false, false, false, false); 
      this.disableApprove = true;
      this.isDisplayFooterButton = true;  
    }
    else {
      this.setButtons(true, false, false, false, true, 'right', 'left');
      this.isDisplayFooterButton = true; 
    }
    if (auth_stat != null && auth_stat != '')
      this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', auth_stat);
  }
  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'AUTH') {
      this.auth();
    } else if (event === 'REJECT') {
      this.reject();
    } else if (event === 'CANCEL') {
      this.cancel();
    } else if (event === 'BACK') {
      this.isSelectedCard = false;
    }
  }
  searchCust() {
    if (this.reqListCust.isFistLoad == '1') {
      this.svcardService.getCardListSearch(this.reqListCust).subscribe(
        (response: any) => {
          console.log(new Date() + ": ", response);
          this.lengthCust = response.lstData?.totalItems || 0;
          this.dataSourceCust = response.lstData?.items || [];
        },
        err => {
          console.log(new Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
    else this.reqListCust.isFistLoad = "1";
  }
  custSelected(rowData: any) {
    var req = {
      isChangeAccount: true,
      custNo: rowData.data.customerId || '',
      cardNo: rowData.data.cardNo || ''
    };
    //getCustommerInfo
    this.svcardService.getCustommerInfo(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);
        this.data.cust_no = rowData.data.customerId;
        this.data.cust_name = response.customerName;
        this.data.unique_id_value = response.identityNo;
        this.data.birth_day = response.birthDate;
        this.data.card_name = response.cardName;
        this.data.card_name_sub = response.cardName;
        this.data.cust_type = this.commonService.getNameById('CUST_TYPE', response.customerType);
        this.data.user_branch = response.account_branch;
        this.data.address_1 = response.address1;
        this.data.address_2 = response.address2;
        this.data.address_3 = response.address3;
        this.data.address_4 = response.address4;
        this.data.cust_mobile = response.phoneMobile;
        this.data.cust_phone = response.phoneHome;
        this.data.product_code = response.product;
        this.data.account_no = rowData.data.accountNo;
        this.data.card_no = response.cardNo;
        this.dataSourceAcc = response.lstAcc;
        if (response.lstAcc && response.lstAcc.length > 0) {
          this.accountSelected = response.lstAcc[0].accountNo;
          //this.data.cust_ac_no = response.lstAcc[0].accountNo;
        }
        let data = this.tokenService.getInfomationFromLocalStorage();
        this.data.branch_code = data.branhcode;
        this.data.country_code = "704";
        this.data.city_code = "HNI";
        this.data.card_type = "TC";

        this.isSelectedCard = true;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  accSelection(event: any) {
    this.accountSelected = event.selectedRowKeys[0].accountNo;
    this.dataGridAcc.dataGrid.instance.refresh();
  }
  create() {
    var req: any = {
      custNo: this.data.cust_no,
      cardNo: this.data.card_no,
      cardAccNewNo: this.accountSelected,
      // branchCode: this.data.user_branch,
      // bankCode: '',
      // makerId: '',
      authId: this.data.auth_id,
    }
    console.log('req: ', req);
    this.svcardService.createCardReissuanceAcc(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.data.reference_no = data.reference_no;
        // this.loadData();
        this.loadButton("U");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  auth() {
    var req: any = {
      id: this.id
    }
    console.log('req: ', req);
    this.svcardService.authCardReissuanceAcc(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("A");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  reject() {
    var req: any = {
      id: this.id
    }
    console.log('req: ', req);
    this.svcardService.rejectCardReissuanceAcc(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("R");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  cancel() {
    var req: any = {
      id: this.id
    }
    console.log('req: ', req);
    this.svcardService.cancelCardReissuanceAcc(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("C");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
