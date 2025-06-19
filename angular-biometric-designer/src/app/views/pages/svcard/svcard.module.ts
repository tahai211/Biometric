import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvcardComponent } from './svcard.component';
import { RouterModule, Routes } from '@angular/router';
import { IdentityComponent } from '../identity/identity.component';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule, DxTemplateModule, DxBulletModule, DxTreeListModule, DxCheckBoxModule, DxTextBoxModule, DxSelectBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxListModule, DxTextAreaModule, DxValidatorModule, DxValidationSummaryModule, DxButtonModule, DxDateBoxModule, DxPopupModule, DxFileUploaderModule } from 'devextreme-angular';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { CardbatchComponent } from './cardbatch/cardbatch.component';
import { CardnewListComponent } from './cardnew-list/cardnew-list.component';
import { CardnewDetailComponent } from './cardnew-detail/cardnew-detail.component';
import { DataGridControlMiniModule } from "../../../shared/components/data-grid-control-mini/data-grid-control-mini.component";
import { CardbatchsearchComponent } from './cardbatchsearch/cardbatchsearch.component';
import { CardrenewListComponent } from './cardrenew-list/cardrenew-list.component';
import { CardrenewDetailComponent } from './cardrenew-detail/cardrenew-detail.component';
import { CardprocessingListComponent } from './cardprocessing-list/cardprocessing-list.component';
import { CardreleasebatchComponent } from './cardreleasebatch/cardreleasebatch.component';
import { CardbatchauthComponent } from './cardbatchauth/cardbatchauth.component';
import { CardbatchauthdetailComponent } from './cardbatchauthdetail/cardbatchauthdetail.component';
import { ScreenButtonGridModule } from 'src/app/shared/components/screen-button-grid/screen-button-grid.component';
import { CardmanagerinforComponent } from './cardmanagerinfor/cardmanagerinfor.component';
import { ChangeaccountcardComponent } from './changeaccountcard/changeaccountcard.component';
import { ChangeaccountcardListComponent } from './changeaccountcard-list/changeaccountcard-list.component';
import { CardrenewExtendListComponent } from './cardrenewextend-list/cardrenewextend-list.component';
import { CardrenewExtendDetailComponent } from './cardrenewextend-detail/cardrenewextend-detail.component';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomTextAreaModule } from 'src/app/shared/components/custom-text-area/custom-text-area.component';
import { CustomDropdownBoxModule } from 'src/app/shared/components/custom-dropdown-box/custom-dropdown-box.component';
import { CustomConfirmNotifyModule } from 'src/app/shared/components/custom-confirm-notify/custom-confirm-notify.component';
import { AdjustCreditCardComponent } from './adjust-credit-card/adjust-credit-card.component';
import { RegisteronlinepaymentListComponent } from './registeronlinepayment-list/registeronlinepayment-list.component';
import { RegisteronlinepaymentDetailComponent } from './registeronlinepayment-detail/registeronlinepayment-detail.component';
import { AdjustCreditCardDetailComponent } from './adjust-credit-card-detail/adjust-credit-card-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SvcardComponent,
    children: [
      {
        path: 'cardnew-list',
        component: CardnewListComponent
      },
      {
        path: 'cardnew-detail',
        component: CardnewDetailComponent
      },
      {
        path: 'cardrenew-list',
        component: CardrenewListComponent
      },
      {
        path: 'cardrenew-detail',
        component: CardrenewDetailComponent
      },
      {
        path: 'cardprocessing-list',
        component: CardprocessingListComponent
      },
      {
        path: 'cardbatch-list',
        component: CardbatchComponent
      },
      {
        path: 'cardbatch-detail',
        component: CardbatchComponent
      },
      {
        path: 'cardbatchsearch-list',
        component: CardbatchsearchComponent
      },
      {
        path: 'cardreleasebatch',
        component: CardreleasebatchComponent
      },
      {
        path: 'cardbatchauth-list',
        component: CardbatchauthComponent
      },
      {
        path: 'cardbatchauth-detail',
        component: CardbatchauthdetailComponent
      },
      {
        path: 'cardmanagerinfor',
        component: CardmanagerinforComponent
      },
      {
        path: 'changeaccountcard',
        component: ChangeaccountcardComponent
      },
      {
        path: 'changeaccountcard-list',
        component: ChangeaccountcardListComponent
      },
      {
        path: 'cardrenewextend-list',
        component: CardrenewExtendListComponent
      },
      {
        path: 'cardrenewextend-detail',
        component: CardrenewExtendDetailComponent
      },
      {
        path: 'adjust-credit-card',
        component: AdjustCreditCardComponent
      },
      {
        path: 'registeronlinepayment-list',
        component: RegisteronlinepaymentListComponent
      },
      {
        path: 'registeronlinepayment-detail',
        component: RegisteronlinepaymentDetailComponent
      },
      {
        path: 'adjust-credit-card-detail',
        component: AdjustCreditCardDetailComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    SvcardComponent,
    CardbatchComponent,
    CardnewListComponent,
    CardnewDetailComponent,
    CardbatchComponent,
    CardbatchsearchComponent,
    CardrenewListComponent,
    CardrenewDetailComponent,
    CardprocessingListComponent,
    CardreleasebatchComponent,
    CardbatchauthComponent,
    CardbatchauthdetailComponent,
    CardmanagerinforComponent,
    ChangeaccountcardComponent,
    ChangeaccountcardListComponent,
    CardrenewExtendListComponent,
    CardrenewExtendDetailComponent,
    AdjustCreditCardComponent,
    RegisteronlinepaymentListComponent,
    RegisteronlinepaymentDetailComponent,
    AdjustCreditCardDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataGridControlModule,
    FormsModule,
    NgbTimepickerModule,
    ScreenButtonModule,
    ScreenButtonGridModule,
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
    DataGridControlMiniModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomTextAreaModule,
    CustomDropdownBoxModule,
    CustomConfirmNotifyModule
  ]
})
export class SvcardModule { }
