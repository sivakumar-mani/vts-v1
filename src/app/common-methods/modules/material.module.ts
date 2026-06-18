// import { NgModule } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatNativeDateModule, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSortModule } from '@angular/material/sort';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTooltipModule } from '@angular/material/tooltip';

// // Prime NG components
// import { TableModule } from 'primeng/table';
// import { MultiSelectModule } from 'primeng/multiselect';
// import { ListboxModule } from 'primeng/listbox';
// import {MatTreeModule} from '@angular/material/tree';
// // import {InputTextModule} from 'primeng/inputtext';
// import { MatGridListModule } from '@angular/material/grid-list';
// import {ProgressBarModule} from 'primeng/progressbar';
// import {MatBadgeModule} from '@angular/material/badge';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
// import { ChipsModule, SliderModule, TabViewModule, TooltipModule } from 'primeng/primeng';
// import {CalendarModule} from 'primeng/calendar';
// import {DropdownModule} from 'primeng/dropdown';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
// // ng2-search-filter removed — not compatible with Angular 17 Ivy
// import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
// const materialModule = [
//   FormsModule,
//   ReactiveFormsModule,
//   MatInputModule,
//   MatAutocompleteModule,
//   MatSelectModule,
//   MatTableModule,
//   MatCheckboxModule,
//   MatDatepickerModule,
//   MatNativeDateModule,
//   MatButtonModule,
//   MatExpansionModule,
//   MatSidenavModule,
//   MatIconModule,
//   MatMenuModule,
//   MatToolbarModule,
//   MatCardModule,
//   MatFormFieldModule,
//   MatTooltipModule,
//   MatSnackBarModule,
//   MatListModule,
//   MatRadioModule,
//   MatChipsModule,
//   MatStepperModule,
//   MatPaginatorModule,
//   MatDialogModule,
//   MatSlideToggleModule,
//   MatTabsModule,
//   MatSortModule,
//   MatProgressBarModule,
//   MatProgressSpinnerModule,
//   TableModule,
//   MultiSelectModule,
//   ListboxModule,
//   MatTreeModule,
//   // InputTextModule
//   // import { MatGridListModule } from '@angular/material/grid-list';
//   MatGridListModule,
//   ProgressBarModule,
//   MatBadgeModule,
//   NgxChartsModule,
//   MatBottomSheetModule,
//   SliderModule,
//   TooltipModule,
//   CalendarModule,
//   DropdownModule,
//   DragDropModule,
//   ChipsModule,
//   GridModule,
//   PDFModule,
//   PDFExportModule,
//   ExcelModule,
//   Ng2SearchPipeModule,
//   TabViewModule,
//   PdfViewerModule
// ];

// @NgModule({
//   imports: [
//     materialModule
//   ],
//   exports: [materialModule],
//   providers: [
//     {
//         provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}
//     }
//   ]
// })
// export class MaterialModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Angular Material */
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

/* CDK */
import { DragDropModule } from '@angular/cdk/drag-drop';

/* PrimeNG */
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipsModule } from 'primeng/chips';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

/* Others */
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
// ng2-search-filter removed — not compatible with Angular 17 Ivy
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';

/* ✅ Centralized module list */
const MATERIAL_MODULES = [
  FormsModule,
  ReactiveFormsModule,

  MatInputModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatTableModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatExpansionModule,
  MatSidenavModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatListModule,
  MatRadioModule,
  MatChipsModule,
  MatStepperModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatSortModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTreeModule,
  MatGridListModule,
  MatBadgeModule,
  MatBottomSheetModule,

  DragDropModule,

  /* PrimeNG */
  TableModule,
  MultiSelectModule,
  ListboxModule,
  ProgressBarModule,
  ChipsModule,
  SliderModule,
  TabViewModule,
  TooltipModule,
  CalendarModule,
  DropdownModule,

  /* Others */
  NgxChartsModule,
  GridModule,
  PDFModule,
  PDFExportModule,
  ExcelModule,
  PdfViewerModule
];

@NgModule({
  imports: [...MATERIAL_MODULES],
  exports: [...MATERIAL_MODULES]
})
export class MaterialModule {}
