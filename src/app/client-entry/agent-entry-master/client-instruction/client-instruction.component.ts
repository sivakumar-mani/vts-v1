import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { ClientInstruction, ClientInstructions } from '../../../common-methods/models/agentEntryMaster';
import { Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';

@Component({
  standalone: false,
  selector: 'app-client-instruction',
  templateUrl: './client-instruction.component.html',
  styleUrls: ['./client-instruction.component.css']
})
export class ClientInstructionComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  clientEntry: any[] = [];
  instructionType: any;
  component: any;
  instruction: any;
  instructionComponentFlag: boolean;
  index = -1;
  columns = [
    { field: 'lookUpName', header: 'Instruction Type	' },
    { field: 'rptType', header: 'Component' },
    { field: 'instruction', header: 'Instruction' },
  ];
  clientInstructionType: any[] = [];
  clientComponentType: any[] = [];
  clientInstruction = new ClientInstruction();
  ins: number;
  errormsg: string;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  tooltip = false;
  clientPolicyId: any;
  dialogRef: any;
  data: any;
  delshowflag: boolean;
  @ViewChild('clientInstructionPopUp', { static: true }) clientInstructionPopUp;
  componentList: any;
  compCloneList: any[] = [];
  instructionName: string;
  updateInsValue: Event;
  isDesc: boolean;
  column: any;
  direction: number;
  itemPerPage = 10;
  page = 1;
  @Input() filterLength: number;

  constructor(public agentEntryMasterService: AgentEntryMasterService, public messageService: MessageService,
    // tslint:disable-next-line:align
    public common: CommonService, private sharedService: SharedService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAgentEntryMasterService();
    this.agentEntryMasterService.clientInstructionFormGroup.reset();
  }
  checkLength(editor: any) {
    if (editor?.textArea?.nativeElement?.innerText) {
      return editor.textArea?.nativeElement?.innerText?.length;
    }
  }
  getAgentEntryMasterService() {
    this.agentEntryMasterService.getClientInstructionDetails
    (this.agentEntryMasterService.clientEntryForm.controls.indianClientFlag.value).subscribe(res => {
      this.clientInstructionType = res.instructionType;
      this.componentList = res.component;
      this.agentEntryMasterService.componentEntryList.forEach(ele => {
        const list = this.componentList.filter(x => x.serviceId === ele.componentId);
        this.clientComponentType.push(list[0]);
        this.compCloneList = this.common.CloneObject(this.clientComponentType);
      });
      this.clientComponentType = this.clientComponentType.filter((el, i, a) => i === a.indexOf(el));
      this.agentEntryMasterService.clientInstructionList.forEach(element => {
        const clientinstructionsName = this.clientInstructionType.filter(x => x.lookUpId ===
          element.instructionTypeId);
        element.lookUpName = clientinstructionsName[0].lookUpName;
        if (element.componentId) {
          const componentName = this.clientComponentType.filter(x => x.serviceId ===
            element.componentId);
          element.rptType = componentName[0].rptType;
          // this.clientComponentType = this.clientComponentType.filter(x => x.serviceId !== element.componentId);
        }
      });
    }, err => {
      console.error(err);
    }, () => {
    });
  }
  selectionChange(instructionType: any) {
    // if (this.agentEntryMasterService.clientInstructionList.length > 0) {
    //   const list = this.agentEntryMasterService.clientInstructionList.filter(x => x.lookUpName === this.common.GEN_INS);
    //   if (list.length > 0) {
    //     const val = list[0].instructionTypeId;
    //     if (val === instructionType) {
    //       if (this.index === -1) {
    //         this.showTopCenter('warn', 'Failure Message', 'Instruction type already exist');
    //         this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.setValue(null);
    //       } else {
    //         if (this.updateInsValue !== instructionType) {
    //           this.showTopCenter('warn', 'Failure Message', 'Instruction type already exist');
    //           this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.setValue(null);
    //         }
    //       }
    //     }
    //   }
    // }
    this.getChange(instructionType);
  }
  getChange(instructionType: any) {
    if (this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.value) {
      // if (instructionType === this.common.GEN_INS) {
      //   this.instructionComponentFlag = true;
      //   this.agentEntryMasterService.clientInstructionFormGroup.get('componentName')?.setValue(null);
      //   this.agentEntryMasterService.clientInstructionFormGroup.get('componentId')?.setValue(null);
      // } else {
      //   this.instructionComponentFlag = false;
      // }
      const instruct = this.clientInstructionType.find(x => x.lookUpId ===
         this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.value);
      this.instructionName = instruct.lookUpName;
      this.agentEntryMasterService.clientInstructionFormGroup.get('instructionName')?.setValue(this.instructionName);
      if (this.instructionName === this.common.GEN_INS) {
        this.instructionComponentFlag = true;
        this.agentEntryMasterService.clientInstructionFormGroup.get('componentName')?.setValue(null);
        this.agentEntryMasterService.clientInstructionFormGroup.get('componentId')?.setValue(null);
      } else {
        this.instructionComponentFlag = false;
      }
    }
  }
  componentChange(e: any) {
    if (e) {
      const comp = this.clientComponentType.filter(x => x.serviceId === e);
      const compName = comp[0].rptType;
      this.agentEntryMasterService.clientInstructionFormGroup.get('componentName')?.setValue(compName);
    }
  }
  AddClientInstruction() {
    // this.ins = this.index;
    this.addValidation();
    if (this.agentEntryMasterService.clientInstructionFormGroup.valid) {
      const clientinstructions: ClientInstructions = {
        clientPolicyId: this.clientPolicyId ? this.clientPolicyId : 0,
        clientId: this.agentEntryMasterService.clientid,
        componentId: this.agentEntryMasterService.clientInstructionFormGroup.get('componentId')?.value,  // el.clientComponentId
        reportType: '',
        instructionTypeId: this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.value,
        instruction: this.agentEntryMasterService.clientInstructionFormGroup.get('instruction')?.value,
        createdBy: 1,
        createdDate: new Date(),
        updatedBy: 1,
        updatedDate: new Date(),
        active: false,
        lookUpName: '',
        rptType: ''
      };
      if (clientinstructions.instructionTypeId) {
        const clientinstructionsName = this.clientInstructionType.find(x => x.lookUpId ===
          clientinstructions.instructionTypeId);
        clientinstructions.lookUpName = clientinstructionsName.lookUpName;
        this.instructionName = clientinstructions.lookUpName;
      }
      if (clientinstructions.componentId) {
        const componentName = this.clientComponentType.filter(x => x.serviceId ===
          clientinstructions.componentId);
        clientinstructions.rptType = componentName[0].rptType;
      }
      if (this.index > -1) {
        this.agentEntryMasterService.clientInstructionList[this.index] = clientinstructions;
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.clientPolicyId = 0;
        this.index = -1;
        this.tooltip = false;
      } else {
        this.agentEntryMasterService.clientInstructionList.push(clientinstructions);
        this.showTopCenter('success', 'Success Message', 'Saved Successfully');
      }
      // tslint:disable-next-line:max-line-length
      // if (this.instructionName === this.common.SPE_INS) {
      //   this.agentEntryMasterService.clientInstructionList.forEach(element => {
      //     if (element.componentId) {
      //       this.clientComponentType = this.clientComponentType.filter(x => x.serviceId !== element.componentId);
      //     }
      //   });
      // }
      // this.dt.reset();
      this.agentEntryMasterService.clientInstructionFormGroup.reset();
      this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.clearValidators();
      this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.updateValueAndValidity();
      this.agentEntryMasterService.clientInstructionFormGroup.get('instruction')?.clearValidators();
      this.agentEntryMasterService.clientInstructionFormGroup.get('instruction')?.updateValueAndValidity();
    }
    // this.agentEntryMasterService.clientInstructionList = undefined; this.index = -1;
  }
  getHtmlDesign(ind, ins) {
    const str = ind.toString();
    if (document.getElementById(str)) {
      const html = document.getElementById(str).innerHTML;
      document.getElementById(str).innerHTML = html.replace(html, ins);
    }
  }
  textChanged(event, editor) {
    const maxLength = editor.textArea?.nativeElement?.innerText.length;
    if (maxLength && maxLength > 3000 && event.key) {
      event.preventDefault();
      return false;
    }
  }
  showNotification(level: string, info: string, message: string) {
    this.sharedService.emitChange({
      severity: level,
      summary: info,
      detail: message
    });
  }
  addValidation() {
    const controlNames1 = ['instructionTypeId', 'componentId', 'instruction'];
    for (const ctrl in this.agentEntryMasterService.clientInstructionFormGroup.controls) {
      if (controlNames1.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).value) {
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
          if (ctrl === 'componentId') {
            if (this.clientInstructionType[0].lookUpId ===
              this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.value) {
              this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).clearValidators();
              this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
            }
          }
        } else {
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).clearValidators();
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
    this.errormsg = 'Please add atleast one Instruction';
  }
  clear() {
    this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.clearValidators();
    this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.updateValueAndValidity();
    this.agentEntryMasterService.clientInstructionFormGroup.get('componentId')?.clearValidators();
    this.agentEntryMasterService.clientInstructionFormGroup.get('componentId')?.updateValueAndValidity();
    this.agentEntryMasterService.clientInstructionFormGroup.get('instruction')?.clearValidators();
    this.agentEntryMasterService.clientInstructionFormGroup.get('instruction')?.updateValueAndValidity();
    this.agentEntryMasterService.clientInstructionFormGroup.reset();
    this.index = -1;
  }
  editDelete(data, mode) {
    this.common.goToTop();
    this.index = this.agentEntryMasterService.clientInstructionList.indexOf(data);
    this.ins = this.index;
    if (mode === 'Edit') {
      const instruct = this.clientInstructionType.find(x => x.lookUpId === data.instructionTypeId);
      this.instructionName = instruct.lookUpName;
      // if (this.instructionName === this.common.SPE_INS) {
      //   const list = this.compCloneList.find(x => x.serviceId === data.componentId);
      //   this.clientComponentType.push(list);
      // }
      this.tooltip = true;
      this.agentEntryMasterService.clientInstructionFormGroup.patchValue({
        componentId: data.componentId,
        instructionTypeId: data.instructionTypeId,
        instruction: data.instruction
      });
      this.updateInsValue = data.instructionTypeId;
      this.clientPolicyId = data.clientPolicyId;
    }
    // this.dt.reset();
  }
  errormsgs() {
    // if (this.delshowflag === true) {
    this.errormsg = 'Please add atleast one Instruction';
    // }
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  // openConfirmDialog(data): void {
  //   this.data = data;
  //   this.dialogRef = this.dialog.open(this.clientInstructionPopUp, {
  //     width: '400px',
  //     disableClose: true
  //   });
  // }
  // dialogClose() {
  //   this.dialogRef.close();
  // }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  removeClientInstruction(data: any) {
    this.index = this.agentEntryMasterService.clientInstructionList.indexOf(data);
    this.ins = this.index;
    if (this.index > -1) {
      this.agentEntryMasterService.clientInstructionList.splice(this.index, 1);
      this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      this.common.goToTop();
      const instruct = this.clientInstructionType.find(x => x.lookUpId === data.instructionTypeId);
      this.instructionName = instruct.lookUpName;
      // if (this.instructionName === this.common.SPE_INS) {
      //   const list = this.compCloneList.filter(x => x.serviceId === data.componentId);
      //   this.clientComponentType.push(list[0]);
      // }
      this.errormsgs();
    }
    // this.dt.reset();
    this.index = -1;
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.removeClientInstruction(data);
          }
        }
      });
    }
  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPage(event: any) {
    this.page = event;
  }
  // getTotalPage(): number {
  //   if (this.agentEntryMasterService.clientInstructionList.length) {
  //     return Math.ceil(this.agentEntryMasterService.clientInstructionList.length / this.itemPerPage);
  //   }
  // }
  preventInfinite() {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
  }
}
