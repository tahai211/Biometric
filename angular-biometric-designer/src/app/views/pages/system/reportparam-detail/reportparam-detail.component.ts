import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { auto } from '@popperjs/core';
// import DevExpress from 'devextreme';
import { ButtonService } from 'src/app/services/button.service';
import { CBSService } from 'src/app/services/cbs.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { reportService } from 'src/app/services/report.service';
import { TokenService } from 'src/app/services/token.services';
import { DataGridControlMiniComponent } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CONST } from 'src/app/shared/const/const';


interface UpdateParamRequest {
  Id: number;
  ParamCode: string;
  ParamName: string;
  ParamType: string;
  ParamValue: string;
}
@Component({
  selector: 'app-reportparam-detail',
  templateUrl: './reportparam-detail.component.html',
  styleUrl: './reportparam-detail.component.scss'
})
export class ReportparamDetailComponent implements OnInit {
  @Input() id: string = '';
  paramName = '';
  paramCode = '';
  // sqlQuery = '';
  paramType!: string;
  paramValue = '';
  lengthCust = 0;
  disableApprove: boolean = false;
  paramTypes = CONST.paramReportTypes;

  constructor(
    public reportService: reportService,
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
      if (this.id != null) {
        this.loadDataDetail();
        this.loadButton("U");
      }else{
        this.loadButton("C");

      }
  }

  loadDataDetail() {
    var req = {
      ParamId: parseInt(this.id)
    };
    this.reportService.detailParamReport(req).subscribe(
      (res: any) => {
        this.paramName = res.param.param_Name;
                  this.paramCode = res.param.param_Code;
                  this.paramType = res.param.param_Type;
                  this.paramValue = res.param.param_Value;
        //this.loadButton(res.data.auth_stat);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }


  setButtons(isSave: boolean, isUpdate: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'CREATE', buttonName: '', disable: false, visibility: isSave },
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate }
    ]);
  }
  loadButton(auth_stat: string) {
    if (auth_stat === 'C') this.setButtons(true, false);
    else if (auth_stat === 'U') this.setButtons(false, true)
    else this.setButtons(true, false);
  }
  onClick(event: any) {
    if (event === 'CREATE') {
      this.create();
    } else if (event === 'UPDATE') {
      this.update();
    } 
    // else if (event === 'REJECT') {
    //   this.reject();
    // } else if (event === 'CANCEL') {
    //   this.cancel();
    // }
  }

  create() {
    const payload: any = {
      ParamCode: this.paramCode,
      ParamName: this.paramName,
      ParamType: this.paramType,
      ParamValue: this.paramValue
    };
    this.reportService.createParamReport(payload).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("U");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  update() {
    const payload: any = {
      Id : parseInt(this.id),
      ParamCode: this.paramCode,
      ParamName: this.paramName,
      ParamType: this.paramType,
      ParamValue: this.paramValue
    };
    this.reportService.updateParamReport(payload).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.loadButton("U");
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  // reject() {
  //   var req: any = {
  //     id: this.id
  //   }
  //   console.log('req: ', req);
  //   this.svcardService.rejectCardReissuanceAcc(req).subscribe(
  //     data => {
  //       console.log(new Date(), data);
  //       this.id = data.id;
  //       this.loadButton("R");
  //       this.notificationService.alertSussess(data.resDesc);
  //     },
  //     err => {
  //       console.log(Date(), err);
  //       this.notificationService.alertError(err.error);
  //     }
  //   );
  // }
  // cancel() {
  //   var req: any = {
  //     id: this.id
  //   }
  //   console.log('req: ', req);
  //   this.svcardService.cancelCardReissuanceAcc(req).subscribe(
  //     data => {
  //       console.log(new Date(), data);
  //       this.id = data.id;
  //       this.loadButton("C");
  //       this.notificationService.alertSussess(data.resDesc);
  //     },
  //     err => {
  //       console.log(Date(), err);
  //       this.notificationService.alertError(err.error);
  //     }
  //   );
  // }
}
