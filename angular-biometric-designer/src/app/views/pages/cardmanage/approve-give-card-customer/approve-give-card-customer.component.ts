import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-approve-give-card-customer',
  templateUrl: './approve-give-card-customer.component.html',
  styleUrl: './approve-give-card-customer.component.scss'
})
export class ApproveGiveCardCustomerComponent {
  card_number: string = "";
  data_card_customer: any = {};

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.card_number = params['card_number'] || '';

      if (this.card_number != '') {
        var req: any = {
          card_number: this.card_number
        }
        console.log("req param: ", req)

        this.cardService.getInfoCardApproveUser(req).subscribe(
          (response: any) => {
            console.log(new Date() + ": ", response);

            if (response.infoCardUser != null)
            {
              this.data_card_customer = response.infoCardUser;
            } 
            else
            {
              this.data_card_customer = {};
            }
          },
          err => {
            console.log(new Date(), err);
            this.notificationService.alertError(err.error);
          }
        );
      } else {
        this.data_card_customer = {};
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private notificationService: NotificationService
  ) {}

  approve() {
    var req: any = {
      card_number: this.card_number
    }

    this.cardService.approveHandOverCard(req).subscribe(
      (response: any) => {
        console.log(new Date() + ": ", response);

        this.notificationService.alertSussess(response.resDesc);
      },
      err => {
        console.log(new Date(), err);
        this.notificationService.alertError(err.error);
      }
    )
  }
}
