import { Component, Input } from '@angular/core';
import DevExpress from 'devextreme';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StatusDetailReqDto } from 'src/app/shared/models/cardmanage/status.detail.req';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
@Component({
  selector: 'app-status-card-detail',
  templateUrl: './status-card-detail.component.html',
  styleUrl: './status-card-detail.component.scss'
})
export class StatusCardDetailComponent {
   @Input() card_number: string = '';
   req: StatusDetailReqDto = new StatusDetailReqDto();
   dataSource: any = {};
   length = 0;

   columns: Array<dxDataGridColumn | string> = [ 
      {
        dataField: 'card_number',
        caption: 'Số thẻ',
      }, 
      {
        dataField: 'created_date',
        caption: 'Ngày',
      },
      {
        dataField: 'status',
        caption: 'Trạng thái',
      }, 
      {
        dataField: 'created_by',
        caption: 'GDV',
      }
    ];

    ngOnInit() {
      this.req.card_number = this.card_number;
    }

    constructor (
      private cardService: CardService,
      private notificationService: NotificationService
    ) {}

    loadData(params: any) {
      console.log('request filter: ', params);
      this.cardService.getCardInfoDetail(params).subscribe(
        (response: any) => {
          console.log(new Date() + ": ", response);
          this.length = response.lstData.totalItems;
          this.dataSource = response.lstData.items;
        },
        err => {
          console.log(new Date(), err);
          this.notificationService.alertError(err.error);
        }
      );
    }
}
