import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardmanageComponent } from './cardmanage.component';
import { SearchStatusCardComponent } from './search-status-card/searchstatuscard.component';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { DxDataGridModule, DxTemplateModule, DxBulletModule, DxTreeListModule, DxCheckBoxModule, DxTextBoxModule, DxSelectBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxListModule, DxTextAreaModule, DxValidatorModule, DxValidationSummaryModule, DxButtonModule, DxDateBoxModule, DxPopupModule } from 'devextreme-angular';
import { StatusCardDetailComponent } from './status-card-detail/status-card-detail.component';
import { ReceiveCardPinComponent } from './receive-card-pin/receive-card-pin.component';
import { GiveCardPinUnitComponent } from './give-card-pin-unit/give-card-pin-unit.component';
import { GiveCardCustomerComponent } from './give-card-customer/give-card-customer.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { ActiveCardComponent } from './active-card/active-card.component';
import { ActiveCardDetailComponent } from './active-card-detail/active-card-detail.component';
import { SearchCardNotActiveComponent } from './search-card-not-active/search-card-not-active.component';
import { ApproveGiveCardCustomerComponent } from './approve-give-card-customer/approve-give-card-customer.component';
import { GenerateQrBatchComponent } from './generate-qr-batch/generate-qr-batch.component';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomConfirmNotifyModule } from 'src/app/shared/components/custom-confirm-notify/custom-confirm-notify.component';

const routes: Routes = [
  {
    path: '',
    component: CardmanageComponent,
    children: [
      {
        path: 'search-status-card',
        component: SearchStatusCardComponent
      },
      {
        path: 'status-card-detail',
        component: StatusCardDetailComponent
      },
      {
        path: 'receive-card-pin',
        component: ReceiveCardPinComponent
      },
      {
        path: 'give-card-pin-unit',
        component: GiveCardPinUnitComponent
      },
      {
        path: 'handover-card-customer',
        component: GiveCardCustomerComponent
      },
      {
        path: 'customer-info',
        component: CustomerInfoComponent
      },
      {
        path: 'active-card',
        component: ActiveCardComponent
      },
      {
        path: 'active-card-detail',
        component: ActiveCardDetailComponent
      },
      {
        path: 'info-card-not-active',
        component: SearchCardNotActiveComponent
      },
      {
        path: 'approve-handover-card-customer',
        component: ApproveGiveCardCustomerComponent
      },
      {
        path: 'generate-qr-batch',
        component: GenerateQrBatchComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    CardmanageComponent,
    SearchStatusCardComponent,
    StatusCardDetailComponent,
    ReceiveCardPinComponent,
    GiveCardPinUnitComponent,
    GiveCardCustomerComponent,
    CustomerInfoComponent,
    ActiveCardComponent,
    ActiveCardDetailComponent,
    SearchCardNotActiveComponent,
    ApproveGiveCardCustomerComponent,
    GenerateQrBatchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataGridControlModule,
    FormsModule,
    NgbTimepickerModule,
    ScreenButtonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
    NgbModule,
    DxTreeListModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxListModule,
    DxTextAreaModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxButtonModule,
    DxDateBoxModule,
    DxPopupModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomConfirmNotifyModule
  ]
})
export class CardmanageModule { }
