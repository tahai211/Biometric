import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { productCreditReq } from 'src/app/shared/models/system/product.credit';
import { CONST } from 'src/app/shared/const/const';
import { ButtonService } from 'src/app/services/button.service';
import { SystemService } from 'src/app/services/system.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-product-credit-detail',
  templateUrl: './product-credit-detail.component.html',
  styleUrl: './product-credit-detail.component.scss'
})
export class ProductCreditDetailComponent implements OnInit {
  @Input() id: string = '';
  @Output()  onLoadListPage = new EventEmitter<void>();
  productCredit_request: productCreditReq = new productCreditReq();
  visibleNotify: boolean = false;
  dataStatus: any[] = CONST.dataRecordStat;
  dataAuthStatus: any[] = CONST.dataAuthStatus;

  confirmHandler!: () => void;
  cancelHandler() { this.visibleNotify = false; };
  titleNotify: string = 'Xác nhận';

  constructor(private buttonService: ButtonService,
    private systemService: SystemService,
    private notificationService: NotificationService,
  ) { }
  ngOnInit(): void {
    this.loadButton('');

    if (this.id && this.id.trim() !== '') {
      this.loadData(this.id);
    }

  }
  loadData(id : string) {
    let req1 = new productCreditReq();
    req1.data.id_trans = id;
    this.systemService.getProductCreditDetail(req1).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.productCredit_request.data = res.data;
        this.loadButton(res.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }

  onClick(event: any) {
  let action: (() => void) | null = null;

  switch (event) {
    case 'CREATE':
      action = this.create.bind(this);
      break;

    case 'UPDATE':
      this.titleNotify = 'Xác nhận cập nhật thông tin';
      action = this.update.bind(this);
      break;

    case 'AUTH':
      this.titleNotify = 'Xác nhận duyệt thông tin';
      action = this.auth.bind(this);
      break;

    case 'REJECT':
      this.titleNotify = 'Xác nhận từ chối thông tin';
      action = this.reject.bind(this);
      break;

    case 'CANCEL':
      this.titleNotify = 'Xác nhận hủy thông tin';
      action = this.cancel.bind(this);
      break;
  }

  if (action) {
    this.visibleNotify = true;
    this.confirmHandler = () => {
      action();
      this.onLoadListPage.emit();
    };
  }
}
  create() {

    var req: any = this.productCredit_request;
    console.log('req: ', req);
    this.systemService.createProductCredit(req).subscribe(
      response => {
        console.log(new Date(), response);
        this.productCredit_request.data.id_trans = response.data.id;
        this.loadButton("U");
        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );

  }
  update() {
    var req: any = this.productCredit_request;
   
    
    this.systemService.updateProductCredit(req).subscribe(
      response => {
        console.log(new Date(), response);
        this.id = response.data.id;
        this.productCredit_request.data.id = response.data.id;
        // this.loadData();
        this.loadButton("U");
        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  auth() {
    var req: any = this.productCredit_request;
    console.log('req: ', req);
    
    this.systemService.authProductCredit(req).subscribe(
      response => {
        console.log(new Date(), response);
        // this.loadData();
        this.loadButton("A");
        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  reject() {
    var req: any = this.productCredit_request;
    console.log('req: ', req);
    
    this.systemService.rejectProductCredit(req).subscribe(
      response => {
        console.log(new Date(), response);
        // this.loadData();
        this.loadButton("R");
        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  cancel() {
    var req: any = this.productCredit_request;
    console.log('req: ', req);
    
    this.systemService.cancelProductCredit(req).subscribe(
      response => {
        console.log(new Date(), response);
        // this.loadData();
        this.loadButton("C");
        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  setButtons(isSave: boolean, isUpdate: boolean, isAuth: boolean, isReject: boolean, isCancel: boolean,
    positionSave: string = 'right', positionUpdate: string = 'right', positionAuth: string = 'right',
    positionReject: string = 'right', positionCancel: string = 'right'
  ) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave, position: positionSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate, position: positionUpdate },
      { buttonCode: 'AUTH', buttonName: '', disable: false, visibility: isAuth, position: positionAuth },
      { buttonCode: 'REJECT', buttonName: '', disable: false, visibility: isReject, position: positionReject },
      { buttonCode: 'CANCEL', buttonName: '', disable: false, visibility: isCancel, position: positionCancel },
    ]);
  }
  loadButton(auth_stat: string) {
    if (auth_stat === 'C') this.setButtons(false, false, false, false, false);
    else if (auth_stat === 'U') this.setButtons(false, false, true, true, true, 'right', 'right', 'right', 'left', 'left');
    else if (auth_stat === 'R') this.setButtons(false, true, false, false, true);
    else if (auth_stat === 'A') this.setButtons(false, true, false, false, false);
    else this.setButtons(true, false, false, false, false);

    this.visibleNotify = false;
  }
}
