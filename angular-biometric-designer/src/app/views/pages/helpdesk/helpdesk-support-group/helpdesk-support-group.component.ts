import { Component, OnInit } from '@angular/core';
import { HelpdeskService } from 'src/app/services/helpdesk.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CONST } from 'src/app/shared/const/const';
import { SupportGroupDto } from 'src/app/shared/models/helpdesk/support.group.dto';

@Component({
  selector: 'app-helpdesk-support-group',
  templateUrl: './helpdesk-support-group.component.html',
  styleUrl: './helpdesk-support-group.component.scss'
})
export class HelpdeskSupportGroupComponent implements OnInit {
  data: SupportGroupDto = new SupportGroupDto();
  dataRecordStat: any[] = CONST.dataRecordStat;

  constructor(
    private helpdeskService: HelpdeskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

  }

  createGroup() {
    var req: any = {
      group_id: this.data.group_id,
      group_name: this.data.group_name,
      record_stat: this.data.record_stat
    }
    console.log('req: ', req);

    this.helpdeskService.createSupportGroup(req).subscribe(
      data => {
        console.log(new Date(), data);

        this.notificationService.alertSussess(data.resDesc);
      },
      err => {
        console.log(Date(), err);

        this.notificationService.alertError(err.error);
      }
    );
  }
}
