import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { NotificationService } from 'src/app/services/notification.service';
import { paramCommonService } from 'src/app/services/param.common.service';
import { svCardService } from 'src/app/services/svcard.service';
import { DataGridControlComponent } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonGridComponent } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { ScreenButtonComponent } from 'src/app/shared/components/screen-button/screen-button.component';
import { CONST } from 'src/app/shared/const/const';
import { ButtonByScreenDto, ButtonCustom } from 'src/app/shared/models/button/button.dto';
import { CardOfCtmReq } from 'src/app/shared/models/svcard/cardofctm.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-cardmanagerinfor',
  templateUrl: './cardmanagerinfor.component.html',
  styleUrl: './cardmanagerinfor.component.scss'
})
export class CardmanagerinforComponent implements OnInit {

  constructor(
    private buttonService: ButtonService,
    private svcardservice: svCardService,
    public notificationService: NotificationService,
    public paramcommonservice: paramCommonService,
    private renderer: Renderer2
    // private resolver: ComponentFactoryResolver,
    // private viewContainerRef: ViewContainerRef,
  ) { }


  @ViewChild('customerGridControl') customerGridControl: DataGridControlComponent;
  @ViewChild('transactionGridControl') transactionGridControl: DataGridControlComponent;
  selectedCardType: string = 'debit';
  // Customer search request
  req: CardOfCtmReq = new CardOfCtmReq();
  dataSourceCollateral: any = {};
  dataBranchs: any[] = [];
  dataUserAuths: any[] = [];
  dataProducts: any[] = [];
  dataCountrys: any[] = [];
  dataCitys: any[] = [];
  // Transaction search request
  transactionReq: any = {
    cardNo: '',
    fromDate: '',
    toDate: ''
  };
  dataCardClass: any[] = CONST.dataCardClass;
  dataFormofguarantee: any[] = CONST.dataFormOfGuarantee;
  isOnlineRegistration: boolean = false;
  isOnlineDebit: boolean = false;
  // Customer info
  customerInfo: any = {
    cif: '',
    name: '',
    identityNo: '',
    birthDate: '',
    accountNo: '',
    activationDate: '',
    cardStatus: '',
    agent: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    city: '',
    country: '',
    printStatus: '',
    cardNo: '',
    product: '',
    cardType: '',
    card_type_code: '',
    cardName: '',
    expiryDate: '',
    changePosition: '',
    card_class: '',
    form_of_guarantee: '',
    primary_card_number: '',
    cardholder_rel: '',
    sub_unique_id_value: '',
    sub_date_gttt: '',
    sub_birth_day: '',
    credit_card_limit: '',
    registration_limit: '',
    debt_ratio: '',
    payment_account: '',
    register_online_payment: false,
    register_auto_debit: false,
  };

  // Grids data
  customerDataSource: any = {};
  customerLength = 0;
  transactionDataSource: any = {};
  transactionLength = 0;
  buttonCustom: ButtonByScreenDto[] = [
    //{ id: '', name: 'Tất cả' },
    { buttonCode: 'VIEW', buttonName: 'Chọn', visibility: true, disable: false },
  ];

  // Add isPageLoaded flag like in searchstatuscard.component
  isPageLoaded: boolean = false;

  onChangeCardType(event: any) {
    this.checkLoadPage();
  }
  getCustomerDetail(params: any) {
    const req = {
      isChangeAccount: false,
      custNo: params.data.customerId || '',
      cardNo: params.data.cardNo || '',
      card_type: this.selectedCardType == 'debit' ? 'D' : 'C'
    }
    this.svcardservice.getCustommerInfo(req).subscribe(
      (response: any) => {
        if (response) {
          this.populateCustomerInfo(response);
          this.transactionReq.cardNo = params.data.cardNo;
          if (response.resCode === "000" && response.resDesc !== "Thành công") {
            this.notificationService.alertError(response.resDesc);
          }
        }
      },
      err => {
        this.notificationService.alertError(err.error);
      }
    );
  }
  columnsCollateral: Array<dxDataGridColumn | string> = [{
    dataField: '',
    caption: 'STT',
    width: '*'
  }, {
    dataField: '',
    caption: 'Mã liên kết',
    width: '*',
  }, {
    dataField: '',
    caption: 'Trị giá TSĐB',
    width: '*'
  }, {
    dataField: '',
    caption: 'Nội dung',
    width: '*'
  }, {
    fixed: true,
    width: auto,
    alignment: 'center',
    cellTemplate: (container, cellInfo) => {
      // Kiểm tra checkbox có được chọn không
      // const checked = this.accountSelected === cellInfo.data.accountNo;

      // // Tạo checkbox
      // const checkbox = this.renderer.createElement('input');
      // this.renderer.setAttribute(checkbox, 'type', 'checkbox');
      // this.renderer.setProperty(checkbox, 'checked', checked);

      // // Thêm sự kiện click để toggle checkbox khi click vào checkbox hoặc row
      // const toggleCheckbox = () => {
      //   this.accountSelected = cellInfo.data.accountNo;
      //   checkbox.checked = true; // Chỉ chọn 1 checkbox
      //   //this.refreshGrid(); // Cập nhật lại grid nếu cần
      // };

      // this.renderer.listen(checkbox, 'click', toggleCheckbox);
      // this.renderer.listen(container, 'click', toggleCheckbox);

      // container.appendChild(checkbox);
    },
  }];
  customerCreditColumns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'accountCredit',
      caption: 'Tài khoản tín dụng',
      width: 150
    }, {
      dataField: 'accountNo',
      caption: 'Tài khoản thanh toán',
      width: 150
    }, {
      dataField: 'customerId',
      caption: 'Mã khách hàng',
      width: 150
    }, {
      dataField: 'customerName',
      caption: 'Tên khách hàng',
      width: 250
    }, {
      dataField: 'identityNo',
      caption: 'Số GTTT',
      width: 150
    }, {
      dataField: 'birthDate',
      caption: 'Ngày sinh',
      width: 150
    }, {
      dataField: 'cardNo',
      caption: 'Số thẻ',
      width: 150
    }, {
      dataField: 'cardType',
      caption: 'Thẻ chính/Phụ',
      width: 150
    }, {
      dataField: 'productName',
      caption: 'Sản phẩm',
      width: 150
    }
  ];

  // Customer grid columns
  customerColumns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'accountNo',
      caption: 'Số tài khoản',
      width: 150
    }, {
      dataField: 'customerId',
      caption: 'Mã KH',
      width: 150
    }, {
      dataField: 'customerName',
      caption: 'Tên KH',
      width: 250
    }, {
      dataField: 'identityNo',
      caption: 'Số GTTT',
      width: 150
    }, {
      dataField: 'birthDate',
      caption: 'Ngày sinh',
      width: 150
    }, {
      dataField: 'cardNo',
      caption: 'Số thẻ',
      width: 150
    }, {
      dataField: 'cardType',
      caption: 'Thẻ chính/Phụ',
      width: 150
    }
  ];
  loadButton(auth_stat: string) {
    if (auth_stat === 'U') this.setButtons(true);
    else this.setButtons(false);
  }
  setButtons(isCancel: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'VIEW', buttonName: '', disable: false, visibility: isCancel },
    ]);
  }

  // Transaction grid columns
  transactionColumns: Array<dxDataGridColumn | string> = [
    {
      dataField: 'stt',
      caption: 'STT',
      width: 50
    }, {
      dataField: 'transactionDescription',
      caption: 'Loại giao dịch',
      width: 200
    }, {
      dataField: 'accountNumber',
      caption: 'Số tài khoản',
      width: 150
    }, {
      dataField: 'authorizationDate',
      caption: 'Ngày giao dịch',
      width: 150
    }, {
      dataField: 'amount',
      caption: 'Số tiền',
      width: 150
    }, {
      dataField: 'DVT',
      caption: 'DVT',
      width: 150
    }, {
      dataField: 'operationDirection',
      caption: 'Nợ/Có',
      width: 150
    }, {
      dataField: 'terminalId',
      caption: 'TID',
      width: 150
    }, {
      dataField: 'issuerInstitutionId',
      caption: 'Đơn vị',
      width: 150
    }, {
      dataField: 'utrnno',
      caption: 'Số Trace',
      width: 150
    }
  ];

  ngOnInit(): void {
    this.setButtons(true);
    // Initialize with isPageLoaded set to false
    this.checkLoadPage();
    this.LoadDetail();
  }
  LoadDetail() {
    var req = {
    };

    this.svcardservice.getCardManagerDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        //this.data.batch_num = res.batch_num;
        this.dataBranchs = res.branchs;
        this.dataUserAuths = res.userauths;
        this.dataCountrys = res.countrys;
        this.dataProducts = res.products
        this.dataCitys = res.citys;

        // if (res.data.cust_no == null || res.data.cust_no == '')
        //   this.data.agent_code = this.data.branch_code;
        // else {
        //   this.data = res.data;
        //   this.dataSourceAcc = res.custAcc;
        //   this.accountSelected = res.data.cust_ac_no;
        //   this.selectedSubAccounts = res.data.sub_card_list;
        //   this.dataGridAcc.dataGrid.instance.refresh();
        //   this.data.cust_type = this.commonService.getNameById('CUST_TYPE', res.data.cust_type);
        // }
        // this.data.auth_stat_text = this.commonService.getNameById('AUTH_STATUS', res.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  // Add checkLoadPage method like in searchstatuscard.component
  checkLoadPage() {
    this.isPageLoaded = false;
    setTimeout(() => {
      this.isPageLoaded = true;
    }, 500);
  }

  reload() {
    // Reset isPageLoaded and then reload data
    this.checkLoadPage();

    // Reset search parameters
    this.req = new CardOfCtmReq();
    this.req.card_type = this.selectedCardType == 'debit' ? 'D' : 'C'
    if (this.customerGridControl) {
      this.customerGridControl.reloadGrid(this.req);
    }
  }

  search() {
    this.req.card_type = this.selectedCardType == 'debit' ? 'D' : 'C'
    if (this.customerGridControl) {
      this.customerGridControl.searchGrid(this.req);
    }
  }

  loadCustomerData(params: any) {
    // Check if the page is loaded like in searchstatuscard.component
    if (this.isPageLoaded == false) {
      this.customerLength = 0;
      this.customerDataSource = {};
      return;
    }
    this.svcardservice.getCardListSearch(params).subscribe(
      (response: any) => {
        this.customerLength = response.lstData?.totalItems || 0;
        this.customerDataSource = response.lstData?.items || [];
      },
      err => {
        this.notificationService.alertError(err.error);
      }
    );
  }

  populateCustomerInfo(customer: any) {
    // Map customer data to the form fields
    this.customerInfo = {
      cif: customer.customerId || '',
      name: customer.customerName || '',
      identityNo: customer.identityNo || '',
      birthDate: customer.birthDate || '',
      accountNo: customer.accountNo || '',
      activationDate: customer.activationDate || '',
      cardStatus: customer.cardStatus || '',
      agent: customer.agent || '',
      address1: customer.address1 || '',
      address2: customer.address2 || '',
      address3: customer.address3 || '',
      address4: customer.address4 || '',
      city: customer.city || '',
      country: customer.country || '',
      printStatus: customer.printStatus || '',
      cardNo: customer.cardNo || '',
      product: customer.product || '',
      cardType: customer.cardType || '',
      card_type_code: customer.card_type_code || '',
      cardName: customer.cardName || '',
      expiryDate: customer.expiryDate || '',
      changePosition: customer.changePosition || '',
      card_class: customer.card_class || '',
      form_of_guarantee: customer.form_of_guarantee || '',
      primary_card_number: customer.primary_card_number || '',
      cardholder_rel: customer.cardholder_rel || '',
      sub_unique_id_value: customer.sub_unique_id_value || '',
      sub_date_gttt: customer.sub_date_gttt || '',
      sub_birth_day: customer.sub_birth_day || '',
      credit_card_limit: customer.credit_card_limit || '',
      registration_limit: customer.registration_limit || '',
      debt_ratio: customer.debt_ratio || '',
      payment_account: customer.payment_account || '',
      register_online_payment: customer.register_online_payment || false,
      register_auto_debit: customer.register_auto_debit || false
    };
    this.isOnlineDebit = customer.register_auto_debit;
    this.isOnlineRegistration = customer.register_online_payment;
  }

  searchTransaction() {
    if (this.transactionGridControl) {
      this.transactionGridControl.searchGrid(this.transactionReq);
    }
  }
  CollateralSelection(event: any) {
    // this.data.cust_ac_no = event.selectedRowKeys[0].accountNo;
    // this.accountSelected = event.selectedRowKeys[0].accountNo;
    // this.dataGridAcc.dataGrid.instance.refresh();
  }

  loadTransactionData(params: any) {
    // Apply the same pattern to transaction data loading
    if (this.isPageLoaded == false) {
      this.transactionLength = 0;
      this.transactionDataSource = {};
      return;
    }

    this.svcardservice.getCardStatementListSearch(params).subscribe(
      (response: any) => {
        this.transactionLength = response.lstData?.totalItems || 0;
        this.transactionDataSource = response.lstData?.items || [];
      },
      err => {
        this.notificationService.alertError(err.error);
      }
    );
  }
}