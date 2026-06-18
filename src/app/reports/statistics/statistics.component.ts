import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  routePath = 'Reports / Report Tracker / Statistics';
  breadcrumbFlags = new BreadcrumbFlags();
  countFormGroup: UntypedFormGroup;
  maxDate = new Date();
  clientlist: any[] = [];
  btnExcelExport = false;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  clientControl!: AutoCompleteDropDown;
  componentControl!: AutoCompleteDropDown;
  componentList: any[] = [];
  // tslint:disable-next-line: no-use-before-declare
  StatisticsVm = new StatisticsVm();
  displayColumns: any[] = [];
  displayStausColumns: any[] = [];
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('dt1', { static: true }) dt1: Table;
  compStatusList: any[] = [];
  compCountList: any[] = [];
  checkFlag: boolean;
  outcompCountList: any[] = [];
  headerText: string;
  headerText1: string;
  userData: any;
  constructor(private fb: UntypedFormBuilder, public masterService: MasterService, public agentEntryService: AgentEntryMasterService,
    public report: ReportService, private message: MessageService, private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getClient();
    this.initFormGroup();
    this.getCommonLookUpDrpDwnDatas();
  }
  initFormGroup() {
    this.countFormGroup = this.fb.group({
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
      clientids: [],
      compId: [],
      flowType: [false],
      caseFlag: [false]
    });
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
      '', this.countFormGroup, false, false, false, 'standard');
    this.componentControl = new AutoCompleteDropDown('Component Name', 'compId', 'componentId', 'componentName', this.componentList,
      '', this.countFormGroup, false, false, false, 'standard');
  }
  getClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientlist = res;
        this.clientControl = new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
          '', this.countFormGroup, false, false, false, 'standard');
      }
    });
  }
  getCommonLookUpDrpDwnDatas() {
    this.report.getCommonLookUpData().subscribe(res => {
      if (res != null) {
        this.componentList = res.componentList;
        this.componentControl = new AutoCompleteDropDown('Component Name', 'compId', 'compId', 'compName',
          this.componentList, '', this.countFormGroup, false, false, false, 'standard');
      }
    })
  }
  GetComponetDetails(clientId: any) {
    if (clientId > 0) {
      this.agentEntryService.GetPackageComponent(clientId).subscribe(res => {
        if (res) {
          this.componentList = res;
          this.componentControl = new AutoCompleteDropDown('Component Name', 'compId', 'componentId', 'componentName',
            this.componentList,
            '', this.countFormGroup, false, false, false, 'standard');
        }
      });
    }
  }
  changeType(val: any) {
    // if (val === true) {
    this.displayColumns = [];
    this.displayStausColumns = [];
    // } else {
    //   this.displayColumns = [
    //     { field: 'compName', header: 'Component Name' },
    //     { field: 'count', header: 'Component Count' }
    //   ];
    //   this.displayStausColumns = [
    //     { field: 'statusName', header: 'Status Name' },
    //     { field: 'count', header: 'Status Count' }
    //   ];
    // }
    this.compCountList = [];
    this.compStatusList = [];
    this.outcompCountList = [];
  }
  searchValue() {
    this.compStatusList = [];
    this.compCountList = [];
    // let clientId:any;
    // clientId = this.countFormGroup.controls.clientids.value.map(m => m.clientId);
    // //this.dynamicReportForm.controls.clientId.setValue(0)
    // this.countFormGroup.controls.clientids.setValue(clientId)

    if (this.countFormGroup.controls.fromDate.value && this.countFormGroup.controls.toDate.value) {
      this.StatisticsVm.fromDate = this.countFormGroup.controls.fromDate.value;
      this.StatisticsVm.toDate = this.countFormGroup.controls.toDate.value;
      this.StatisticsVm.clientId = this.countFormGroup.get('clientids')?.value ?
        this.countFormGroup.controls.clientids.value.map(m => m.clientId) : [];
      this.StatisticsVm.compId = this.countFormGroup.controls.compId.value > 0 ?
        this.countFormGroup.controls.compId.value : 0;
      this.StatisticsVm.caseFlag = this.countFormGroup.controls.caseFlag.value;
      this.StatisticsVm.outFlow = this.countFormGroup.controls.flowType.value;
      this.countFormGroup.controls.caseFlag.value === true ?
        this.checkFlag = true : this.checkFlag = false;
      this.report.GetStatisticsComponentList(this.StatisticsVm).subscribe(resp => {
        if (resp) {
          // console.log(this.countFormGroup.controls.caseFlag.value, 'result');
          if (this.countFormGroup.controls.flowType.value === false) {
            if (this.countFormGroup.controls.caseFlag.value === false) {
              this.headerText = 'Inflow Status';
              this.displayStausColumns = [
                { field: 'statusName', header: 'Status Name' },
                { field: 'count', header: 'Status Count' }
              ];
              this.compCountList = resp.componentCount;

              this.headerText1 = 'Inflow Component';
              this.displayColumns = [
                { field: 'compName', header: 'Component Name' },
                { field: 'count', header: 'Component Count' }
              ];
              this.compStatusList = resp.compStatusCount;
              if ((resp.componentCount && (resp.componentCount.length === 0 || resp.componentCount === null)) &&
                (resp.compStatusCount && (resp.compStatusCount.length === 0 || resp.compStatusCount === null))) {
                this.showTopCenter('warn', 'Info Message', 'No Record Found');
              }
            } else {
              this.displayStausColumns = [
                { field: 'status', header: 'Status Name' },
                { field: 'count', header: 'Status Count' }
              ];
              this.headerText = 'Inflow Status';
              this.compStatusList = resp.caseStatusCount;
              this.displayColumns = [
                { field: 'clientName', header: 'Client Name' },
                { field: 'count', header: 'Case Count' }
              ];
              this.headerText1 = 'Inflow Case';
              this.compCountList = resp.casesCount;
              if ((resp.caseStatusCount && (resp.caseStatusCount.length === 0 || resp.caseStatusCount === null)) &&
                (resp.casesCount && (resp.casesCount.length === 0 || resp.casesCount === null))) {
                this.showTopCenter('warn', 'Info Message', 'No Record Found');
              }
            }
            if (this.compStatusList.length > 0 && this.compCountList.length > 0) {
              this.btnExcelExport = true;
            } else {
              this.btnExcelExport = false;
            }
          } else {
            if (this.countFormGroup.controls.caseFlag.value === false) {
              this.displayStausColumns = [
                { field: 'colourCode', header: 'Color Code' },
                { field: 'compName', header: 'Component Name' },
                { field: 'count', header: 'Color Code Count' }
              ];
              this.headerText = 'Outflow Color Code';
              this.compStatusList = resp.outCompStatusCount;
              this.displayColumns = [
                { field: 'compName', header: 'Component Name' },
                { field: 'count', header: 'Component Count' }
              ];
              this.headerText1 = 'Outflow Component';
              this.compCountList = resp.componentCount;
              if ((resp.outCompStatusCount && (resp.outCompStatusCount.length === 0 || resp.outCompStatusCount === null)) &&
                (resp.componentCount && (resp.componentCount.length === 0 || resp.componentCount === null))) {
                this.showTopCenter('warn', 'Info Message', 'No Record Found');
              }
            } else {
              this.compStatusList = resp.outCaseStatusCount;
              this.displayStausColumns = [
                { field: 'colourCode', header: 'Color Code' },
                { field: 'clientName', header: 'Client Name' },
                { field: 'count', header: 'Color Code Count' }
              ];
              this.headerText = 'Outflow Color Code';
              this.compCountList = resp.casesCount;
              this.displayColumns = [
                { field: 'clientName', header: 'Client Name' },
                { field: 'count', header: 'Case Count' }
              ];
              this.headerText1 = 'Outflow Case';
              if ((resp.outCaseStatusCount && (resp.outCaseStatusCount.length === 0 || resp.outCaseStatusCount === null)) &&
                (resp.casesCount && (resp.casesCount.length === 0 || resp.casesCount === null))) {
                this.showTopCenter('warn', 'Info Message', 'No Record Found');
              }
            }
            if (this.compStatusList.length > 0 && this.compCountList.length > 0) {
              this.btnExcelExport = true;
            } else {
              this.btnExcelExport = false;
            }
          }
          // console.log(resp, 'case');
          if (((resp.componentCount && (resp.componentCount.length === 0 || resp.componentCount === null)) &&
            (resp.compStatusCount && (resp.compStatusCount.length === 0 || resp.compStatusCount === null))) &&
            ((resp.outCaseStatusCount && (resp.outCaseStatusCount.length === 0 || resp.outCaseStatusCount === null)) &&
              (resp.casesCount && (resp.casesCount.length === 0 || resp.casesCount === null))) &&
            ((resp.outCompStatusCount && (resp.outCompStatusCount.length === 0 || resp.outCompStatusCount === null)) &&
              (resp.componentCount && (resp.componentCount.length === 0 || resp.componentCount === null))) &&
            ((resp.caseStatusCount && (resp.caseStatusCount.length === 0 || resp.caseStatusCount === null)) &&
              (resp.casesCount && (resp.casesCount.length === 0 || resp.casesCount === null)))) {
            this.showTopCenter('warn', 'Info Message', 'No Record Found');
          }
        }
      });
    } else {
      this.countFormGroup.controls.fromDate.markAsTouched();
      this.countFormGroup.controls.toDate.markAsTouched();
    }
  }
  resetFunc() {
    this.countFormGroup.controls.clientId.setValue('');
    this.countFormGroup.controls.compId.setValue('');
    if (this.compCountList.length > 0 && this.compStatusList.length > 0) {
      this.compCountList = [];
      this.compStatusList = [];
    } else {
      this.btnExcelExport = false;
    }
  }
  exportAsExcelFile() {
    // export to excel file
    let tabtext = '<table border="1px">&nbsp;';
    let tabtext1 = '<table border="1px">';
    // var textRange;
    let j = 0;
    const header = this.dt.columns;
    const header1 = this.dt1.columns;
    // header.splice(0, 1);
    const filteredValue = this.dt.filteredValue ? this.dt.filteredValue : this.dt.value; // id of table
    const filteredValue1 = this.dt1.filteredValue ? this.dt1.filteredValue : this.dt1.value;
    const lines = filteredValue.length;
    const lines1 = filteredValue1.length;
    let headerColos = '';
    let headerColos1 = '';
    // the first headline of the table
    if (lines > 0) {
      header.forEach(h => {
        headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    if (lines1 > 0) {
      header1.forEach(h => {
        headerColos1 = headerColos1 + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
      });
      tabtext1 = tabtext1 + '<tr>' + headerColos1 + '</tr>';
    }
    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + filteredValue[j][h.field] + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    for (j = 0; j < lines1; j++) {
      headerColos1 = '';
      header1.forEach(h => {
        headerColos1 = headerColos1 + '<td style="font-size:12px">' + filteredValue1[j][h.field] + '</td>';
      });
      tabtext1 = tabtext1 + '<tr>' + headerColos1 + '</tr>';
    }
    tabtext = tabtext + '&nbsp;' + tabtext1 + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
    const fileName = 'StatisticsCount.xls';
    const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });

    if ((window.navigator as any).msSaveBlob) { // IE 10+
      (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
    } else {
      const link = document.createElement('a'); // create link download file
      link.href = window.URL.createObjectURL(exceldata); // set url for link download
      link.setAttribute('download', fileName); // set attribute for link created
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // this.exportAsExcelFile1(filteredValue, 'testreport', header);
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
}
export class StatisticsVm {
  clientId: any;
  fromDate: any;
  toDate: any;
  compId: number;
  caseFlag: boolean;
  outFlow: boolean;
}