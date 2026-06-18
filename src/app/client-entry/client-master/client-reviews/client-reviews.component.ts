import { Component, OnInit, Input } from '@angular/core';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.css']
})
export class ClientReviewsComponent implements OnInit {
  @Input() mainForm: any;
  @Input() formValue: any;
  @Input() clientBindData: any;
  @Input() componentBindData: any;
  @Input() agreementBindData: any;
  @Input() instructionBindData: any;
  @Input() mailBindData: any;
  compCols: string[] = ['ComponentName', 'ComponentDesc', 'EffectiveDate', 'Fees', 'Currency', 'Tat', 'DaCompValidationFlag','Interim Report', 'Additional period of stay'];
  compFeeCols: string[] = ['ComponentType', 'ComponentDesc', 'FileName', 'MSP', 'NRP', 'REQUESTEDAMOUNT'];
  compTatCols: string[] = ['ComponentType', 'ComponentDesc', 'FileName', 'TAT', 'REQUESTEDTAT'];
  instructionColumns: string[] = ['InstructionType', 'Component', 'Instruction'];
  mailColumns = ['Category', 'SendType', 'Report', 'SendEmail'];
  expandedElement: any | null;
  feeDoc: any[] = [];
  tatDoc: any[] = [];
  @Input() currencyList: any;

  constructor(public clientService: ClientService, public commonService: CommonService) { }

  ngOnInit() {
    this.mainForm.get('reviewFlag')?.setValue(true);
    this.formValue.componentEntry.forEach(element => {
      let val = this.commonService.CloneObject(element);
      if (element.isSubComponent === true) {
        val = element.subComponentEntry[0];
      }
      if (val.clientFeesApproval) {
        if (val.clientFeesApproval.clientFeeDocument.length > 0) {
          let feeDoc: any[] = [];
          feeDoc.push(...val.clientFeesApproval.clientFeeDocument);
          feeDoc.forEach(xx => {
            xx.componentDesc = element.componentDesc;
            xx.nrp = element.nrp;
            xx.msp = element.msp;
            xx.fees = element.fees;
          });
          this.feeDoc.push(...feeDoc);
        }
      }
      if (val.clientTATApproval) {
        if (val.clientTATApproval.clientTATDocument.length > 0) {
          let tatDoc: any[] = [];
          tatDoc.push(...val.clientTATApproval.clientTATDocument);
          tatDoc.forEach(yy => {
            yy.componentDesc = element.componentDesc;
            yy.originalTAT = element.originalTAT;
            yy.tat = element.tat;
          });
          this.tatDoc.push(...tatDoc);
        }
      }
    });
  }
  getClientSettings(){
     let clientSet = this.formValue.clientEntry.clientSettings;
   return clientSet;
  }
  getNameById(list, listId, listName, findId) {
    const value = this.commonService.getNameById(list, listId, listName, findId);
    return value ? value : '--';
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.formValue.clientInstruction.forEach((element, ind) => {
      if (element.instruction) {
        if (element.instruction.length <= 200) {
          element.instructioncount = 1;
          element.showmore = 'Show Less';
          element.instructionDescsplice = element.instruction;
        } else if (element.instruction.length > 200) {
          element.instructioncount = 0;
          element.instructionDescsplice = element.instruction.slice(0, 199);
          element.showmore = 'Show More';
        }
      } else {
        element.instructionDescsplice = '';
      }
    });
  }
  instructionShowHide(element1, i: number) {
    this.formValue.clientInstruction.forEach((element, ind) => {
      if (element1.instruction === element.instruction && ind === i) {
        if (element.instruction) {
          if (element.instructionDescsplice.length <= 200) {
            element.showmore = 'Show Less';
            element.instructionDescsplice = element.instruction;
          } else if (element.instructionDescsplice.length > 200) {
            element.instructionDescsplice = element.instruction.slice(0, 199);
            element.showmore = 'Show More';
          }
        }
      }
    });
  }
}
