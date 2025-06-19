import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-active-card-detail',
  templateUrl: './active-card-detail.component.html',
  styleUrl: './active-card-detail.component.scss',
})
export class ActiveCardDetailComponent {
  @Input() data_card_customer: any = {};  
  isButtonVisible = true;

  constructor(
    private cardService: CardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isButtonVisible = true;
  }

  active() {
    var req: any = {
      lst_card_number: [this.data_card_customer.card_number]
    }
    console.log('req_active_card: ', req)

    this.cardService.activeCard(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc);

        this.isButtonVisible = false;
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    );
  }
}
