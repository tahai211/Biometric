import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardService } from 'src/app/services/card.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserDto } from 'src/app/shared/models/identity/user.dto';
import { SelectDto } from 'src/app/shared/models/select.dto';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.scss',
})
export class CustomerInfoComponent {
  @Input() data_card_customer: any = {};
  @Input() lstUserForAuth: any = [];
  name_user_confirm = "";
  isButtonVisible = true;

  constructor(
    private cardService: CardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isButtonVisible = true;
  }

  displayItemSelect = (item: any) => {
    return item ? `${item.user_name} - ${item.full_name}` : '';
  };

  handover() {
    var req: any = {
      card_number: this.data_card_customer.card_number,
      user_confirm: this.name_user_confirm
    }
    console.log('req_handover: ', req)

    this.cardService.handOverCard(req).subscribe(
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
