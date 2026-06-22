import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'


@Component({
  standalone: false,
  selector: 'app-research-business-category-mapping',
  templateUrl: './research-business-category-mapping.component.html',
  styleUrls: ['./research-business-category-mapping.component.css']
})
export class ResearchBusinessCategoryMappingComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Master / Research Business Category Mapping';
  screenAuth: any = {};
  Businesscategory: any[] = [];
  ResearchEmp: any[] = [];
  showFlag = false;
  QuestionFormgroup: UntypedFormGroup;
  QuestionVm: QuestionVm[] = [];
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  categoryControls!: AutoCompleteDropDown;
  selectedEmpList: any[] = [];
  catList: any[] = [];
  displayedColumns = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'businessCategoryLookupName', header: 'Category Name' },
    { field: 'questionName', header: 'Question Name' }
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  totalpages: number;
  editList: any[] = [];
  checkFlag: boolean;
  constructor(private masterService: MasterService, public common: CommonService, private message: MessageService, private fb: UntypedFormBuilder,
    private authservice: AuthService,
    private router: Router, public dialog: MatDialog) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.getresearchquestion();
    this.getAllData();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.QuestionFormgroup = this.fb.group({
      businessQuestionTransId: [0],
      businessCategoryLookupId: ['', Validators.required],
      questionId: [0],
      active: [true],
      deleteFlag: [false],
      logginId: [],
      businessCategoryLookupName: []
    });
    this.categoryControls = new AutoCompleteDropDown('Category Name', 'businessCategoryLookupId', 'lookUpId', 'lookUpName',
      this.Businesscategory, '', this.QuestionFormgroup, false, false, true);
  }
  getAllData() {
    this.masterService.GetAllResearchBusinessCatQuestion().subscribe(res => {
      this.catList = res;
      if (this.ResearchEmp.length > 0) {
        this.catList.forEach(ele => {
          const quesList = this.ResearchEmp.find(x => x.questionId === ele.questionId);
          if (quesList) {
            ele.questionName = quesList.questionName;
          }
        });
      }
    });
  }
  getcategorylookup() {
    this.masterService.GetBusinessCategoryLookUp().subscribe(res => {
      if (res) {
        this.Businesscategory = res;
        this.categoryControls = new AutoCompleteDropDown('Category Name', 'businessCategoryLookupId', 'lookUpId', 'lookUpName',
          this.Businesscategory, '', this.QuestionFormgroup, false, false, true);
        // console.log(this.Businesscategory);
      }
    });
  }
  getresearchquestion() {
    this.masterService.GetResearchEmpInsList().subscribe(res => {
      if (res != null) {
        this.ResearchEmp = res;
        this.selectedEmpList = [];
        if (this.editList.length > 0) {
          const busneslist = this.ResearchEmp.filter(x => x.questionId === this.editList[0].questionId);
          if (busneslist.length > 0) {
            this.selectedEmpList = busneslist;
          }
        }
      }
    });
  }

  addEmpAns() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags(false);
    this.showFlag = !this.showFlag;
    this.getresearchquestion();
    this.getcategorylookup();
  }

  saveQues() {
    if (this.QuestionFormgroup.valid && this.selectedEmpList.length > 0) {
      const catName = this.Businesscategory.find(x => x.lookUpId === this.QuestionFormgroup.controls.businessCategoryLookupId.value);
      this.selectedEmpList.forEach(ele => {
        const quesObj: QuestionVm = {
          businessQuestionTransId: this.QuestionFormgroup.controls.businessQuestionTransId.value,
          businessCategoryLookupId: this.QuestionFormgroup.controls.businessCategoryLookupId.value,
          questionId: ele.questionId,
          active: this.QuestionFormgroup.controls.active.value,
          deleteFlag: this.QuestionFormgroup.controls.deleteFlag.value,
          logginId: this.userData.userId,
          businessCategoryLookupName: catName.lookUpName
        };
        quesObj.businessQuestionTransId > 0 ? this.checkFlag = true : this.checkFlag = false;
        this.QuestionVm.push(quesObj);
      });
      this.masterService.AddtResearchBusinessCatQues(this.QuestionVm).subscribe(res => {
        if (res) {
          if (this.checkFlag === true) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          }
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.QuestionFormgroup.markAllAsTouched();
    }
  }
  editQues(data: any) {
    this.masterService.GetResearchBusinessCatQuestion(data.businessQuestionTransId).subscribe(res => {
      this.editList = res;
      this.addEmpAns();
      this.QuestionFormgroup.patchValue({
        businessQuestionTransId: res[0].businessQuestionTransId,
        businessCategoryLookupId: res[0].businessCategoryLookupId,
        questionId: res[0].questionId,
        active: res[0].active,
        deleteFlag: res[0].deleteFlag,
        logginId: this.userData.userId,
        businessCategoryLookupName: ''
      });
      if (this.ResearchEmp.length > 0) {
        const busneslist = this.ResearchEmp.filter(x => x.questionId === res[0].questionId);
        if (busneslist.length > 0) {
          this.selectedEmpList = busneslist;
        }
      }
    });
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
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
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteQues(data.businessQuestionTransId);
          }
        }
      });
    }
  }
  deleteQues(businessId: any) {
    this.masterService.DeleteResearchBusinessCatQuestion(this.userData.userId, businessId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getAllData();
      }
    });
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
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.QuestionFormgroup.reset();
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
    this.getAllData();
  }
  resetForm() {
    const editrecordCheckCategoryId = this.QuestionFormgroup.controls.recordCheckCategoryId.value;
    this.QuestionFormgroup.controls.recordCheckCategoryId.setValue(0);
    this.QuestionFormgroup.reset();
  }
  showall() {
    if (this.catList.length > 0) {
      this.itemperpage = this.catList.length;
    }
  }
}
export class QuestionVm {
  businessQuestionTransId: number;
  businessCategoryLookupId: number;
  questionId: number;
  active: boolean;
  deleteFlag: boolean;
  logginId: number;
  businessCategoryLookupName: string;
}