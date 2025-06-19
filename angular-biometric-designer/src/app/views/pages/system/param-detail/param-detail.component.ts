import { Component, Input, OnInit } from '@angular/core';
import { ButtonService } from 'src/app/services/button.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SystemService } from 'src/app/services/system.service';
import { CONST } from 'src/app/shared/const/const';
import { ParamDto } from 'src/app/shared/models/system/param.dto';

@Component({
  selector: 'app-param-detail',
  templateUrl: './param-detail.component.html',
  styleUrls: ['./param-detail.component.scss']
})
export class ParamDetailComponent implements OnInit {
  @Input() id: string = '';
  data: ParamDto = new ParamDto();
  dataParamType: any[] = CONST.paramType;
  dataDay: any[] = CONST.dataDay;
  dataWeek: any[] = CONST.dataWeek;
  dataMonth: any[] = CONST.dataMonth;
  selectedTime: Date = new Date();
  disable: boolean = false;
  accepted: boolean = false;
  constructor(
    private systemService: SystemService,
    private notificationService: NotificationService,
    private buttonService: ButtonService
  ) {

  }
  ngOnInit(): void {
    this.loadData();
  }
  setButtons(isUpdate: boolean) {
    this.buttonService.setDataButtonPage([
      { buttonCode: 'UPDATE', buttonName: '', disable: false, visibility: isUpdate },
    ]);
  }
  loadData() {
    var req = {
      id: this.id
    }
    console.log(new Date() + ": ", req);
    this.systemService.getParamDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data = res.data;
        this.selectedTime = new Date(new Date().toDateString() + ' ' + this.data.job_time);
        this.setButtons(true);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
  onClick(event: any) {
    if (event === 'UPDATE') {
      this.disable = true;
      this.accepted = true;
      // this.update();
    }

  }
  cancel() {
    this.disable = false;
    this.accepted = false;

  }
  update() {
    var req: any = {
      id: this.id,
      param_name: this.data.param_name,
      param_value: this.data.param_value,
      job_type: this.data.job_type,
      job_interval: this.data.job_interval,
      job_time: `${this.selectedTime.getHours()}:${this.selectedTime.getMinutes()}:00`,
      job_day_of_week: this.data.job_day_of_week,
      job_day_of_month: this.data.job_day_of_month,
      job_month: this.data.job_month
    }
    // console.log('req: ', req);
    // this.notificationService.confirm('Xác nhận cập nhật thông tin?').then((confirmed) => {
    //   if (confirmed) {
    this.systemService.updateParam(req).subscribe(
      data => {
        console.log(new Date(), data);
        this.id = data.id;
        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
    //   }
    // });
  }
}
