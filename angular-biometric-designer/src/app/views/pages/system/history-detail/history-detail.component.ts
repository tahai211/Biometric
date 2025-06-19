import { Component, Input, OnInit } from '@angular/core';
import { ButtonService } from 'src/app/services/button.service';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SystemService } from 'src/app/services/system.service';
import { HistoryDto } from 'src/app/shared/models/system/history.dto';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  @Input() id: string = '';
  data: HistoryDto = new HistoryDto();
  disable: boolean = true;
  constructor(
    private systemService: SystemService,
    private notificationService: NotificationService,
    private buttonService: ButtonService,
    private commonService: CommonService
  ) {

  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    var req = {
      id: this.id
    }
    console.log(new Date() + ": ", req);
    this.systemService.getHistoryDetail(req).subscribe(
      (res: any) => {
        console.log(new Date() + ": ", res);
        this.data = res.data;
        this.data.system_id = this.commonService.getNameById('SYSTEM_ID', this.data.system_id);
        this.data.http_method = this.commonService.getNameById('HTTP_METHOD', this.data.http_method);
        this.data.http_status_code = this.commonService.getNameById('HTTP_STATUS_CODE', this.data.http_status_code);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
