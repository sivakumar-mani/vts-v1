import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanactivateGuard } from '../common-methods/guards/canactivate.guard';
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PackageSelectionComponent } from './package-selection/package-selection.component';
import { BilledInvoiceComponent } from './billed-invoice/billed-invoice.component';
import { UnbilledInvoiceComponent } from './unbilled-invoice/unbilled-invoice.component';
import { SkipInvoiceComponent } from './skip-invoice/skip-invoice.component';
import { GenerateInvoiceClientListComponent } from './generate-invoice-client-list/generate-invoice-client-list.component';
import { ManualRegInvoiceComponent } from './manual-reg-invoice/manual-reg-invoice.component';

const routes: Routes = [
    {
        path: 'previewInvoice', component: PreviewInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Invoice' }
    },
    {
        path: 'generateInvoice', component: GenerateInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Generate Invoice' }
    },
    {
        path: 'viewInvoice', component: ViewInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'View Invoice' }
    },
    {
        path: 'choosePackage', component: PackageSelectionComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Choose Package' }
    },
    {
        path: 'billedList', component: BilledInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Billed Case List' }
    },
    {
        path: 'unBilledList', component: UnbilledInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'UnBilled Case List' }
    },
    {
        path: 'generatedInvoice', component: GenerateInvoiceClientListComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Generate Invoice Client List' }
    },
    {
        path: 'skipInvoice', component: SkipInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Skip Invoice' }
    },
    {
        path: 'manualRegisterInvoice', component: ManualRegInvoiceComponent,
        canActivate: [CanactivateGuard], data: { moduleName: 'Invoice', screenName: 'Manual Register' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule { }
