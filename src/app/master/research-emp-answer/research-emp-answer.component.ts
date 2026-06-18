import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { MasterService } from 'src/app/common-methods/services/master.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ResearchEmpQues, ResearchCommonEmpIns, ResearchOptionVm } from 'src/app/common-methods/models/researchQuesAns';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MatDialog } from '@angular/material/dialog';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-research-emp-answer',
  templateUrl: './research-emp-answer.component.html',
  styleUrls: ['./research-emp-answer.component.css']
})
export class ResearchEmpAnswerComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = '';
  userData: any;
  screenAuth: any = {};
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  displayedColumns = [
    { field: 'questionName', header: 'Question Name' },
    { field: 'questionWithUrl', header: 'URL' }
  ];
  optionListColumn = [
    { field: 'optionName', header: 'Options' },
    { field: 'active', header: 'Active' }
  ];
  reserchEmpQues = new ResearchEmpQues();
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  employeeAnsFormGroup: UntypedFormGroup;
  showFlag = false;
  empInsAnsList: any[] = [];
  ansQuesList: any[] = [];
  @Input() typeansFlag = false;
  questionControl!: AutoCompleteDropDown;
  optionList: any[] = [];
  addFlag: boolean;
  fullOptionList: any;
  filterOptionList: any[] = [];
  tempGetList: any[] = [];
  constructor(public master: MasterService, public common: CommonService,
    private fb: UntypedFormBuilder, private message: MessageService, public dialog: MatDialog,private authservice: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getoptionList();
    this.getEmployeeinstDetails();
    if (this.typeansFlag === true) {
      this.routePath = 'Configure / Master / Research Institution Answer';
    } else {
      this.routePath = 'Configure / Master / Research Employee Answer';
    }
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.employeeAnsFormGroup = this.fb.group({
      questionId: ['', Validators.required],
      options: [null],
      active: [true],
      logginId: [],
    });
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.employeeAnsFormGroup, false, false, true);
  }
  getEmployeeinstDetails() {
    this.ansQuesList = [];
    if (this.typeansFlag === true) {
      this.master.GetInstitutionResearchQuestionAnswer(0).subscribe(resp => {
        if (resp) {
          this.empInsAnsList = resp;
          this.tempGetList = resp;
          this.empInsAnsList.forEach((ele) => {
            this.ansQuesList.push(({ questionId: ele.questionId, questionName: ele.questionName }));
          });
        }
      });
    } else {
      this.master.GetEmployeeResearchQuestionAnswer(0).subscribe(resp => {
        if (resp) {
          this.empInsAnsList = resp;
          this.tempGetList = resp;
          this.empInsAnsList.forEach((ele) => {
            this.ansQuesList.push(({ questionId: ele.questionId, questionName: ele.questionName }));
          });
        }
      });
    }
  }
  getOptions(e: any) {
    this.filterOptionList = [];
    this.employeeAnsFormGroup.get('options')?.setValue('');
    if (e) {
      const quesList = this.empInsAnsList.filter(x => x.questionId === e);
      if (quesList[0].options !== null) {
        this.optionList = quesList[0].options;
        this.optionList.forEach(ele => {
          const dataList = this.fullOptionList.filter(x => x.lookUpName === ele.optionName);
          if (dataList.length > 0) {
            this.filterOptionList.push(dataList[0]);
          }
        });
        this.employeeAnsFormGroup.get('options')?.setValue(this.filterOptionList);
      }
    }
  }
  addEmpAns() {
    this.initFormGroup();
    this.addFlag = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  getoptionList() {
    this.master.GetOptions().subscribe(resp => {
      if (resp) {
        this.fullOptionList = resp;
      }
    });
  }
  saveEmpAns() {
    if (!this.showFlag) {
      this.openDialog('approve');
    } else {
      let splitList: any[] = [];
      if (this.optionList.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.optionList.length; i++) {
          this.employeeAnsFormGroup.value.options[i].loggedIn = this.optionList[i].answerId;
        }
      }
      const empAns = this.employeeAnsFormGroup.value;
      empAns.options.forEach(ele => {
        const obj: ResearchOptionVm = {
          answerId: ele.loggedIn,
          optionId: ele.lookUpId,
          optionName: ele.lookUpName,
          progressBarValue: ele.progressBarValue,
          detAvailable: ele.detAvailable,
          subDetId: ele.subDetId,
          displayOrder: ele.displayOrder,
          active: empAns.active,
          subDetail: ele.subDetail
        };
        splitList.push(obj);
      });
      this.reserchEmpQues.options = splitList;
      this.reserchEmpQues.active = empAns.active;
      this.reserchEmpQues.questionId = empAns.questionId;
      this.reserchEmpQues.logginId = this.userData.userId;
      if (this.reserchEmpQues.questionId > 0 && this.optionList === null && this.employeeAnsFormGroup.get('options')?.value) {
        this.employeeAnsFormGroup.get('options')?.clearValidators();
        this.employeeAnsFormGroup.get('options')?.updateValueAndValidity();
      } else {
        this.employeeAnsFormGroup.get('options')?.setValidators(Validators.required);
        this.employeeAnsFormGroup.get('options')?.markAsTouched();
        this.employeeAnsFormGroup.get('options')?.updateValueAndValidity();
      }
      if (this.employeeAnsFormGroup.valid) {
        if (this.employeeAnsFormGroup.get('options')?.value) {
          if (this.typeansFlag === true) {
            this.master.AddInstitutionResearchQuestionAnswer(this.reserchEmpQues).subscribe(resp => {
              if (resp === false) {
                if (this.addFlag === true) {
                  this.showTopCenter('success', 'Success Message', 'Saved Successfully');
                } else {
                  this.showTopCenter('success', 'Success Message', 'Updated Successfully');
                }
                this.getEmployeeinstDetails();
                this.closeForm();
                this.reserchEmpQues = new ResearchEmpQues();
              }
            });
          } else {
            this.master.addEmployeeResearchAnswer(this.reserchEmpQues).subscribe(resp => {
              if (resp === false) {
                if (this.addFlag === true) {
                  this.showTopCenter('success', 'Success Message', 'Saved Successfully');
                } else {
                  this.showTopCenter('success', 'Success Message', 'Updated Successfully');
                }
                this.getEmployeeinstDetails();
                this.closeForm();
                this.reserchEmpQues = new ResearchEmpQues();
              }
            });
          }
        } else {
          this.showTopCenter('warn', 'Alert Message', 'Your Options are empty');
        }
      } else {
        this.employeeAnsFormGroup.markAllAsTouched();
      }
    }
  }
  editEmpQues(data: any) {
    this.optionList = [];
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.employeeAnsFormGroup, false, false, true);
    this.employeeAnsFormGroup.patchValue(data);
    this.addFlag = false;
    this.filterOptionList = [];
    this.employeeAnsFormGroup.get('options')?.setValue('');

    if (data.options !== null && data.options.length > 0) {
      this.optionList = data.options;
      this.optionList.forEach(ele => {
        const dataList = this.fullOptionList.filter(x => x.lookUpName === ele.optionName);
        if (dataList.length > 0) {
          this.filterOptionList.push(dataList[0]);
        }
      });
      this.employeeAnsFormGroup.get('options')?.setValue(this.filterOptionList);
    }
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnAdd = false;
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags.btnBack = true;
    this.showFlag = true;
  }
  onRowReorder(rowData, data) {
    if (rowData) {
      if (data !== null) {
        if (rowData.dragIndex < rowData.dropIndex) {
          data.filter(e => e.displayOrder > rowData.dragIndex && e.displayOrder <= rowData.dropIndex)
            .forEach(r => r.displayOrder = r.displayOrder - 1);
          data[rowData.dropIndex - 1].displayOrder = rowData.dropIndex;
        } else {
          data.filter(e => e.displayOrder >= rowData.dropIndex + 1 && e.displayOrder <= rowData.dragIndex + 1)
            .forEach(a => a.displayOrder = a.displayOrder + 1);
          data[rowData.dropIndex].displayOrder = rowData.dropIndex + 1;
        }
      }
      this.breadcrumbFlags.toolTip = 'Update';
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnBack = false;
      this.breadcrumbFlags.btnReset = false;
      this.breadcrumbFlags.btnAdd = true;
      this.breadcrumbFlags.btnResetTbl = true;
    }
  }
  public openDialog(data: any) {
    const popupData = {
      action: data === 'approve' ? this.common.APPROVE : this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: data === 'approve' ? 'Do you want to save re-ordered records?' : 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (data === 'approve') {
            if (action === this.common.APPROVE) {
              this.updateReorder();
            }
          } else {
            if (action === this.common.DELETECONFIRMATION) {
              this.deleteAns(data);
            }
          }
        }
      });
    }
  }
  updateReorder() {
    this.tempGetList.map(m => m.logginId = this.userData.userId);
    if (this.typeansFlag === true) {
      this.master.UpdateInstitutionResearchQuestionAnswerDisplayOrder(this.tempGetList).subscribe(res => {
        if (res === true) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.getEmployeeinstDetails();
          this.dialog.closeAll();
        }
      });
    } else {
      this.master.UpdateEmployeeResearchQuestionAnswerDisplayOrder(this.tempGetList).subscribe(res => {
        if (res === true) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.getEmployeeinstDetails();
          this.dialog.closeAll();
        }
      });
    }
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnBack = false;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnAdd = true;
    this.breadcrumbFlags.btnResetTbl = true;
  }
  deleteAns(data: any) {
    if (this.typeansFlag === true) {
      this.master.DeleteInstitutionResearchAnswer(data, this.userData.userId).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
          this.getEmployeeinstDetails();
        }
      });
    } else {
      this.master.DeleteEmployeeResearchAnswer(data, this.userData.userId).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
          this.getEmployeeinstDetails();
        }
      });
    }
  }
  closeForm() {
    this.showFlag = false;
    this.addFlag = true;
    this.getEmployeeinstDetails();
    this.breadcrumbFlags.btnAdd = true;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnBack = false;
    this.breadcrumbFlags.btnResetTbl = true;
  }
  resetTbl() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }
  resetForm() {
    this.employeeAnsFormGroup.reset();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
  showall() {
    if(this.empInsAnsList.length>0){
    this.itemperpage = this.empInsAnsList.length;}
  }
}
