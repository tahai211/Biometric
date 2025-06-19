import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HelpdeskComponent } from './helpdesk.component';
import { HelpdeskListComponent } from './helpdesk-list/helpdesk-list.component';
import { HelpdeskDetailComponent } from './helpdesk-detail/helpdesk-detail.component';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridModule, DxTemplateModule, DxBulletModule, DxTreeListModule, DxCheckBoxModule, DxTextBoxModule, DxSelectBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxListModule, DxTextAreaModule, DxValidatorModule, DxValidationSummaryModule, DxButtonModule, DxDateBoxModule, DxPopupModule } from 'devextreme-angular';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { HelpdeskSupportGroupComponent } from './helpdesk-support-group/helpdesk-support-group.component';
import { HelpdeskAssignSupportGroupComponent } from './helpdesk-assign-support-group/helpdesk-assign-support-group.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { AddIssueNewComponent } from './add-issue-new/add-issue-new.component';
import { DataGridControlMiniModule } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { ResponseNewComponent } from './response-new/response-new.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';
import { CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomSelectBoxModule } from 'src/app/shared/components/custom-select-box/custom-select-box.component';
import { CustomTextAreaModule } from 'src/app/shared/components/custom-text-area/custom-text-area.component';


const routes: Routes = [
  {
    path: '',
    component: HelpdeskComponent,
    children: [
      {
        path: 'list',
        component: HelpdeskListComponent
      },
      {
        path: 'detail',
        component: HelpdeskDetailComponent
      },
      {
        path: 'support-group',
        component: HelpdeskSupportGroupComponent
      },
      {
        path: 'assign-support-group',
        component: HelpdeskAssignSupportGroupComponent
      },
      {
        path: 'review-list',
        component: ReviewListComponent
      },
      {
        path: 'review-add-issue-new',
        component: AddIssueNewComponent
      },
      {
        path: 'review-response-new',
        component: ResponseNewComponent
      }
    ]
  },
]
@NgModule({
  declarations: [HelpdeskComponent,
    HelpdeskListComponent,
    HelpdeskDetailComponent,
    HelpdeskSupportGroupComponent,
    HelpdeskAssignSupportGroupComponent,
    ReviewListComponent,
    AddIssueNewComponent,
    ResponseNewComponent,
    TransactionDetailComponent
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
    DataGridControlMiniModule,
    CustomDateBoxModule,
    CustomButtonModule,
    CustomLabelModule,
    CustomTextBoxModule,
    CustomSelectBoxModule,
    CustomHeaderTitleModule,
    CustomTextAreaModule
  ]
})
export class HelpdeskModule { }
