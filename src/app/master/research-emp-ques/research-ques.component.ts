import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { MasterService } from 'src/app/common-methods/services/master.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ResearchEmpQues, ResearchCommonEmpIns } from 'src/app/common-methods/models/researchQuesAns';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-research-ques',
  templateUrl: './research-ques.component.html',
  styleUrls: ['./research-ques.component.css']
})
export class ResearchQuesComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = '';
  userData: any;
  screenAuth: any = {};
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  displayedColumns = [
    { field: 'questionName', header: 'Question Name' },
    { field: 'questionWithUrl', header: 'URL' },
    { field: 'description', header: 'Description' },
    { field: 'verifyStep', header: 'Verification Step' }
  ];
  reserchEmpQues = new ResearchEmpQues();
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  employeeQuesFormGroup: UntypedFormGroup;
  showFlag = false;
  empInsQuesList: any[] = [];
  qaControls: ResearchCommonEmpIns;
  emitResearchValues: any;
  @Input() streamFlag = false;
  tempGetList: any[] = [];
  constructor(public master: MasterService, public common: CommonService,
    private fb: UntypedFormBuilder, private message: MessageService, public dialog: MatDialog ,private router: Router,private authservice: AuthService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.getEmployeeinstDetails();
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    if (this.streamFlag === true) {
      this.routePath = 'Configure / Master / Research Institution Question';
    } else {
      this.routePath = 'Configure / Master / Research Employee Question';
    }
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.employeeQuesFormGroup = this.fb.group({
      questionId: [0],
      questionName: ['', Validators.required],
      questionWithUrl: ['', Validators.required],
      description: [''],
      verifyStep: [],
      displayOrder: [0],
      attachmentReqFlag: [false],
      active: [true],
      logginId: []
    });
  }
  getEmployeeinstDetails() {
    if (this.streamFlag === true) {
      this.master.GetInstitutionResearchQuestion(0).subscribe(resp => {
        if (resp) {
          this.empInsQuesList = resp;
          this.tempGetList = resp;
          // console.log(resp, 'ins');
        }
      });
    } else {
      this.master.GetResearchEmpIns(0).subscribe(resp => {
        if (resp) {
          this.empInsQuesList = resp;
          this.tempGetList = resp;
          // console.log(resp, 'emp');
        }
      });
    }
  }
  addEmpQues() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    if (this.streamFlag === true) {
      this.qaControls = new ResearchCommonEmpIns(this.employeeQuesFormGroup, 'Institution', 'Question');
    } else {
      this.qaControls = new ResearchCommonEmpIns(this.employeeQuesFormGroup, 'Employee', 'Question');
    }
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  emitEmpQues(e: ResearchCommonEmpIns) {
    this.emitResearchValues = e;
    // console.log(this.emitResearchValues, 'op');
  }
  saveEmpQues() {
    if (!this.showFlag) {
      this.openDialog('approve');
    } else {
      if (this.emitResearchValues) {
        this.reserchEmpQues = this.emitResearchValues.researchFormGroup.value;
        this.reserchEmpQues.logginId = this.userData.userId;
        this.reserchEmpQues.verifyStep = Number(this.reserchEmpQues.verifyStep);
        this.reserchEmpQues.options = [];
        if (this.employeeQuesFormGroup.valid) {
          if (this.streamFlag === true) {
            this.master.addInstitutionResearchQuestion(this.reserchEmpQues).subscribe(resp => {
              if (resp) {
                if (this.reserchEmpQues.questionId > 0) {
                  this.showTopCenter('success', 'Success Message', 'Updated Successfully');
                } else {
                  this.showTopCenter('success', 'Success Message', 'Saved Successfully');
                }
                this.getEmployeeinstDetails();
                this.closeForm();
                this.reserchEmpQues = new ResearchEmpQues();
              }
            });
          } else {
            this.master.addEmployeeResearchQuestion(this.reserchEmpQues).subscribe(resp => {
              if (resp) {
                if (this.reserchEmpQues.questionId > 0) {
                  this.showTopCenter('success', 'Success Message', 'Updated Successfully');
                } else {
                  this.showTopCenter('success', 'Success Message', 'Saved Successfully');
                }
                this.getEmployeeinstDetails();
                this.closeForm();
                this.reserchEmpQues = new ResearchEmpQues();
              }
            });
          }
        } else {
          this.employeeQuesFormGroup.markAllAsTouched();
        }
      }
    }
  }
  editEmpQues(data: any) {
    if (this.streamFlag === true) {
      this.qaControls = new ResearchCommonEmpIns(this.employeeQuesFormGroup, 'Institution', 'Question');
    } else {
      this.qaControls = new ResearchCommonEmpIns(this.employeeQuesFormGroup, 'Employee', 'Question');
    }
    this.employeeQuesFormGroup.patchValue(data);
    this.breadcrumbFlags.toolTip = 'Update';
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnAdd = false;
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags.btnBack = true;
    this.showFlag = true;
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
              this.deleteQues(data);
            }
          }
        }
      });
    }
  }
  updateReorder() {
    this.tempGetList.map(m => m.logginId = this.userData.userId);
    if (this.streamFlag === true) {
      this.master.UpdateInstitutionResearchQuestionDisplayOrder(this.tempGetList).subscribe(res => {
        if (res === true) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.getEmployeeinstDetails();
          this.dialog.closeAll();
        }
      });
    } else {
      this.master.UpdateEmployeeResearchQuestionDisplayOrder(this.tempGetList).subscribe(res => {
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
  onRowReorder(rowData: any) {
    if (rowData) {
      if (rowData.dragIndex < rowData.dropIndex) {
        this.tempGetList.filter(e => e.displayOrder > rowData.dragIndex && e.displayOrder <= rowData.dropIndex)
          .forEach(r => r.displayOrder = r.displayOrder - 1);
        this.tempGetList[rowData.dropIndex - 1].displayOrder = rowData.dropIndex;
      } else {
        this.tempGetList.filter(e => e.displayOrder >= rowData.dropIndex + 1 && e.displayOrder <= rowData.dragIndex + 1)
          .forEach(a => a.displayOrder = a.displayOrder + 1);
        this.tempGetList[rowData.dropIndex].displayOrder = rowData.dropIndex + 1;
      }
      this.breadcrumbFlags.toolTip = 'Update';
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnBack = false;
      this.breadcrumbFlags.btnReset = false;
      this.breadcrumbFlags.btnAdd = true;
      this.breadcrumbFlags.btnResetTbl = true;
    }
  }
  deleteQues(data: any) {
    if (this.streamFlag === true) {
      this.master.DeleteInstitutionResearchQuestion(data, this.userData.userId).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
          this.getEmployeeinstDetails();
        }
      });
    } else {
      this.master.DeleteEmployeeResearchQuestion(data, this.userData.userId).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
          this.getEmployeeinstDetails();
        }
      });
    }
  }
  closeForm() {
    this.showFlag = false;
    this.getEmployeeinstDetails();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
  }
  resetTbl() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }
  resetForm() {
    this.employeeQuesFormGroup.reset();
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
    if (this.empInsQuesList.length > 0) {
      this.itemperpage = this.empInsQuesList.length;
    }
  }
}
