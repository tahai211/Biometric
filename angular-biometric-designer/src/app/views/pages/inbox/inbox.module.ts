import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { DataGridControlModule } from 'src/app/shared/components/data-grid-control/data-grid-control.component';
import { ScreenButtonModule } from 'src/app/shared/components/screen-button/screen-button.component';
import { DxBulletModule, DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxListModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule, DxTextAreaModule, DxTextBoxModule, DxTreeListModule, DxTreeViewModule, DxValidationSummaryModule, DxValidatorModule } from 'devextreme-angular';
import { DataGridControlMiniModule } from 'src/app/shared/components/data-grid-control-mini/data-grid-control-mini.component';
import { CustomDateBoxComponent, CustomDateBoxModule } from 'src/app/shared/components/custom-date-box/custom-date-box.component';
import { CustomButtonModule } from 'src/app/shared/components/custom-button/custom-button.component';
import { CustomLabelModule } from 'src/app/shared/components/custom-label/custom-label.component';
import { CustomTextBoxComponent, CustomTextBoxModule } from 'src/app/shared/components/custom-text-box/custom-text-box.component';
import { CustomHeaderTitleModule } from 'src/app/shared/components/custom-header-title/custom-header-title.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent
  }
]

@NgModule({
  declarations: [InboxComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeahterIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
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
    CustomHeaderTitleModule
  ]
})
export class InboxModule { }
