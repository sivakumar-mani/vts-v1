import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ClientEmailConfig } from 'src/app/common-methods/models/agentEntryMaster';
import { AgentEntryMasterComponent } from '../agent-entry-master.component';

@Component({
  standalone: false,
  selector: 'app-client-review',
  templateUrl: './client-review.component.html',
  styleUrls: ['./client-review.component.css'],
})
export class ClientReviewComponent implements OnInit {

  dataSource: ClientEmailConfig[] = [];
  columnsToDisplay = ['Category', 'SendType', 'Report', 'SendEmail'];
  expandedElement: ClientEmailConfig | null;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  clientEntryData: any;
  clientInstructionData: any;
  clientAgreementData: any;
  clientEmailData: any[] = [];
  clientFeeApprovalList: any;
  compdetail: any;
  pathParameters: string[];
  routePath = 'Client / clientReview';
  mattableSource = new MatTableDataSource([]);
  instrucTableSource = new MatTableDataSource([]);
  emailTableSource:any = new MatTableDataSource<any>([]);
  clientFeeTableSource = new MatTableDataSource<any>([]);
  clientTATTableSource = new MatTableDataSource<any>([]);
  tableColumnsheaders: string[] = ['ComponentName', 'ComponentDesc', 'EffectiveDate', 'Fees', 'Currency', 'Tat'];
  instrTableColumnsheaders: string[] = ['InstructionType', 'Component', 'Instruction'];
  emailTableColumnsheaders: string[] = ['Category', 'SendType', 'Report', 'SendEmail'];
  feeTableColumnheaders: string[] = ['ComponentType', 'ComponentDesc', 'FileName', 'MSP', 'NRP', 'REQUESTEDAMOUNT'];
  tatTableColumnheaders: string[] = ['ComponentType', 'ComponentDesc', 'FileName', 'TAT', 'REQUESTEDTAT'];
  address: any;
  clientTATApprovalList: any;
  resList: any;
  currency: any;

  constructor(public agentEntryMasterService: AgentEntryMasterService, public masterService: MasterService,
              public commonService: CommonService, public agentcomp: AgentEntryMasterComponent) { }

  ngOnInit() {
    this.agentEntryMasterService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currency = res;
        this.currency.forEach(element => {
          element.currencyShortName = element.countryName + ' - ' + element.currencyShortName;
        });
      }
    });
    this.agentEntryMasterService.reviewFlag = true;
    this.getAdressDetails();
    this.clientEntryData = this.agentEntryMasterService.clientEntryForm.value;
    this.clientEntryData.clientName = this.agentEntryMasterService.clientEntryForm.get('clientName')?.value;
    this.compdetail = this.agentEntryMasterService.componentEntryList;
    this.clientInstructionData = this.agentEntryMasterService.clientInstructionList;
    this.clientAgreementData = this.agentEntryMasterService.agreementDetailsForm.value;
    this.clientEmailData = this.agentEntryMasterService.clientEmailConfig;
    this.mattableSource = this.compdetail;
    this.instrucTableSource = this.clientInstructionData;
    this.emailTableSource = this.clientEmailData;
    this.dataSource = this.agentEntryMasterService.clientEmailConfig;
    this.clientFeeApprovalList = this.agentEntryMasterService.clientFeePreApprovalEmailList;
    this.clientFeeTableSource = this.clientFeeApprovalList;
    this.clientTATApprovalList = this.agentEntryMasterService.clientTATPreApprovalEmailList;
    this.clientTATTableSource = this.clientTATApprovalList;
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.clientInstructionData) {
      if (this.clientInstructionData.length > 0) {
        this.clientInstructionData.forEach((element, ind) => {
          if (element.instruction) {
            if (element.instruction.length <= 200) {
              element.instructioncount = 1;
              element.showmore = 'Show Less';
              element.instructionDescsplice = element.instruction;
            } else if (element.instruction.length > 200) {
              element.instructioncount = 0;
              element.instructionDescsplice = element.instruction.slice(0,199);
              element.showmore = 'Show More';
            }
            const str = ind.toString();
            const html = document.getElementById(str).innerHTML;
            document.getElementById(str).innerHTML = html.replace(html, element.instructionDescsplice);
            this.getHtml(element.instructionDescsplice, ind);
          } else {
            element.instructionDescsplice = '';
          }
        });
      }
    }
  }
  getName(currencyId: any) {
    if (this.currency) {
      return this.currency.find(x => x.currencyId === currencyId).currencyShortName;
    }
  }
  getHtml(val, ind) {
    setTimeout(() => {
      const str = ind.toString();
      const html = document.getElementById(str).innerHTML;
      document.getElementById(str).innerHTML = html.replace(html, val);
    }, 10);
  }
  getAdressDetails() {
    this.masterService.getAddressDetailByZipCode(this.agentEntryMasterService.clientEntryForm.value.address.postalCode).subscribe(resp => {
      if (resp) {
        this.address = resp;
        const cityList = resp.cityList.filter(x => x.cityId === this.agentEntryMasterService.clientEntryForm.value.address.cityId);
        if (cityList.length > 0) {
          this.address.cityName = cityList[0].cityName;
        }
        const locationList = resp.locationList.filter(x => x.locationId ===
           this.agentEntryMasterService.clientEntryForm.value.address.locationId);
        if (locationList.length > 0) {
          this.address.locationName = locationList[0].locationName;
        }
      } else {
        this.masterService.GetStatesList(this.agentEntryMasterService.clientEntryForm.value.address.countryId).subscribe(res => {
          if (res) {
            this.resList = res;
            const resFilterList = this.resList.find(x => x.stateId === this.agentEntryMasterService.clientEntryForm.value.address.stateId);
            this.address = resFilterList;
          }
        });
      }
    });
  }
  instructionShowHide(element1, i: number) {
    this.clientInstructionData.forEach((element, ind) => {
      if (element1.instruction === element.instruction && ind === i) {
        if (element.instruction) {
          if (element.instructionDescsplice.length <= 200) {
            element.showmore = 'Show Less';
            element.instructionDescsplice = element.instruction;
          } else if (element.instructionDescsplice.length > 200) {
            element.instructionDescsplice = element.instruction.slice(0, 199);
            element.showmore = 'Show More';
            const pageTop = document.getElementById('instructionDescsplice');
            if (pageTop) {
              pageTop.parentElement.scrollIntoView();
            }
          }
          const str = ind.toString();
          const html = document.getElementById(str).innerHTML;
          document.getElementById(str).innerHTML = html.replace(html, element.instructionDescsplice);
        }
      }
    });
  }
  downloadFile(data, filename, docId) {
    if (docId) {
      this.agentEntryMasterService.getDocumentDetail(docId).subscribe(resp => {
        if (resp.document) {
          const sampleArr = this.commonService.base64ToArrayBuffer(resp.document);
          this.commonService.saveByteArray(filename, sampleArr);
        } else {
          alert('file does not exists');
        }
      });
    } else {
      this.commonService.saveByteArray(filename, data.document);
      }
    }
  }
