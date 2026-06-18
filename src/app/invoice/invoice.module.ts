import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { SharedModule } from '../common-methods/modules/shared.module';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PackageSelectionComponent } from './package-selection/package-selection.component';
import { BilledInvoiceComponent } from './billed-invoice/billed-invoice.component';
import { UnbilledInvoiceComponent } from './unbilled-invoice/unbilled-invoice.component';
import { SkipInvoiceComponent } from './skip-invoice/skip-invoice.component';
import { GenerateInvoiceClientListComponent } from './generate-invoice-client-list/generate-invoice-client-list.component';
import { ManualRegInvoiceComponent } from './manual-reg-invoice/manual-reg-invoice.component';
import { FeechangeHistoryComponent } from './feechange-history/feechange-history.component';



@NgModule({
    declarations: [PreviewInvoiceComponent, ViewInvoiceComponent, PackageSelectionComponent,
         BilledInvoiceComponent, UnbilledInvoiceComponent, SkipInvoiceComponent, GenerateInvoiceClientListComponent, ManualRegInvoiceComponent, FeechangeHistoryComponent],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        SharedModule
    ]
})
export class InvoiceModule { }
