import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { MasterService } from 'src/app/common-methods/services/master.service';
import { ResearchEmpQues, ResearchSubDetTransVm } from 'src/app/common-methods/models/researchQuesAns';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-qa-subdetail',
  templateUrl: './qa-subdetail.component.html',
  styleUrls: ['./qa-subdetail.component.css']
})
export class QASubdetailComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Master / Research QA Subdetail';
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
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  menubar = [{ menuName: 'Employee' }, { menuName: 'Institution' }];
  showFlag = false;
  subDetails: any[] = [];
  tabIndex = 0;
  reserchEmpQues = new ResearchEmpQues();
  QAList: any[] = [];
  QAFormGroup: UntypedFormGroup;
  qaCheckFlag = new UntypedFormControl(true);
  questionControl!: AutoCompleteDropDown;
  optionControl!: AutoCompleteDropDown;
  addFlag: boolean;
  fullOptionList: any[] = [];
  ansQuesList: any[] = [];
  optionList: any[] = [];

  constructor(public master: MasterService, public fb: UntypedFormBuilder, public common: CommonService, private message: MessageService,
    private authservice: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
//Added By Megala -for enable /Disable icon flag getting -10/06/2024
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.getSubDetails();
    this.getQASubdetail();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.QAFormGroup = this.fb.group({
      questionId: [, Validators.required],
      options: this.fb.array([this.initOptionForm()]),
      active: [true],
      logginId: []
    });
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.QAFormGroup, false, false, true);
    const val = this.QAFormGroup.get('options') as UntypedFormArray;
    const frmGroup = val.controls[0] as UntypedFormGroup;
  }
  initOptionForm(): UntypedFormGroup {
    return this.fb.group({
      answerId: [],
      answerName: [],
      optionId: [0],
      optionName: [''],
      progressBarValue: [],
      detAvailable: [],
      subDetId: [],
      subDetail: [null],
      displayOrder: [],
      active: [],
    });
  }
  getformgroup() {
     return (this.QAFormGroup.get('options') as UntypedFormArray).controls;
  }
  getSubDetails() {
    this.master.GetResearchSubDetailLookUp().subscribe(resp => {
      if (resp) {
        this.subDetails = resp;
      }
    });
  }
  getQASubdetail() {
    this.QAList = [];
    this.ansQuesList = [];
    if ((this.tabIndex === 0 && this.showFlag !== true) || (this.showFlag === true && this.qaCheckFlag.value === true)) {
      this.master.GetEmployeeResearchQuestionAnswerSubDetail(0).subscribe((resp: ResearchEmpQues[]) => {
        if (resp) {
          this.QAList = resp;
          this.QAList.map(m => m.typeFlag = true);
          this.QAList.forEach((ele) => {
            this.ansQuesList.push(({ questionId: ele.questionId, questionName: ele.questionName }));
          });
        }
      });
    }
    if ((this.tabIndex === 1 && this.showFlag === false) || (this.showFlag === true && this.qaCheckFlag.value === false)) {
      this.master.GetInstitutionResearchQuestionAnswerSubDetail(0).subscribe((resp: ResearchEmpQues[]) => {
        if (resp) {
          this.QAList = resp;
          this.QAList.map(m => m.typeFlag = false);
          this.QAList.forEach((ele) => {
            this.ansQuesList.push(({ questionId: ele.questionId, questionName: ele.questionName }));
          });
        }
      });
    }
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.QAFormGroup, false, false, true);
  }
  qaChange(ind: any) {
    this.tabIndex = ind;
    this.getQASubdetail();
  }
  addQA() {
    this.tabIndex = 0;
    this.initFormGroup();
    this.addFlag = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  getOptions(e: any) {
    this.optionList = [];
    this.initFormGroup();
    this.QAFormGroup.get('questionId')?.setValue(e);
    if (e) {
      const quesList = this.QAList.filter(x => x.questionId === e);
      if (quesList[0].options !== null) {
        this.optionList = quesList[0].options;
        if (this.optionList.length > 0) {
          this.optionList.forEach((ele, i) => {
            const opt = this.QAFormGroup.get('options') as UntypedFormArray;
            opt.push(this.initOptionForm());
            const frmGroup = opt.controls[i] as UntypedFormGroup;
            frmGroup.get('answerName')?.setValue(ele.optionName);
            frmGroup.get('answerId')?.setValue(ele.answerId);
            frmGroup.get('optionId')?.setValue(ele.optionId);
            frmGroup.get('optionName')?.setValue(ele.optionName);
            frmGroup.get('progressBarValue')?.setValue(ele.progressBarValue);
            frmGroup.get('detAvailable')?.setValue(ele.detAvailable);
            frmGroup.get('subDetId')?.setValue(ele.subDetId);
            frmGroup.get('active')?.setValue(true);
            frmGroup.get('displayOrder')?.setValue(ele.displayOrder);
          });
          (this.QAFormGroup.get('options') as UntypedFormArray).controls.pop();
        }
      }
    }
  }
  typeChange() {
    this.initFormGroup();
  }
  saveQA() {
    this.QAFormGroup.value.options.forEach((element, i) => {
      const opt = this.QAFormGroup.get('options') as UntypedFormArray;
      const subfrmGroup = opt.controls[i] as UntypedFormGroup;
      subfrmGroup.removeControl('answerName');
      if (subfrmGroup.value.subDetail === null || subfrmGroup.value.subDetail.length === 0) {
        subfrmGroup.get('subDetail')?.setValidators(Validators.required);
        subfrmGroup.get('subDetail')?.updateValueAndValidity();
      }
    });
    const reserchQues = this.QAFormGroup.value;
    this.reserchEmpQues.logginId = this.userData.userId;
    if (this.QAFormGroup.valid) {
      if (reserchQues.options.length > 0 && reserchQues.options !== null) {
        reserchQues.options.forEach(ele => {
          let subList: any[] = [];
          if (ele.subDetail !== null && ele.subDetail.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < ele.subDetail.length; i++) {
              const obj: ResearchSubDetTransVm = {
                subDetTransId: ele.subDetail[i].loggedIn,
                lookUpId: ele.subDetail[i].lookUpId,
                lookUpName: ele.subDetail[i].lookUpName,
                displayOrder: 0,
                active: ele.subDetail[i].active
              };
              subList.push(obj);
            }
            ele.subDetail = subList;
          }
        });
      }
      this.reserchEmpQues = reserchQues;
      if (this.qaCheckFlag.value === true) {
        this.master.AddEmployeeResearchQuestionAnswerSubDetail(this.reserchEmpQues).subscribe(resp => {
          if (resp === true) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.getQASubdetail();
            this.closeForm();
          }
        });
      }
      if (this.qaCheckFlag.value === false) {
        this.master.AddInstitutionResearchQuestionAnswerSubDetail(this.reserchEmpQues).subscribe(resp => {
          if (resp === true) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.getQASubdetail();
            this.closeForm();
          }
        });
      }
    } else {
      this.QAFormGroup.markAsTouched();
    }
  }
  editQA(data: any) {
    this.initFormGroup();
    this.optionList = [];
    this.qaCheckFlag.setValue(data.typeFlag);
    this.questionControl = new AutoCompleteDropDown('Question Name', 'questionId', 'questionId', 'questionName', this.ansQuesList,
      '', this.QAFormGroup, false, false, true);
    if (data.options !== null) {
      this.QAFormGroup.patchValue(data);
      if (data.questionId) {
        const quesList = this.QAList.filter(x => x.questionId === data.questionId);
        if (quesList[0].options !== null) {
          this.optionList = quesList[0].options;
          if (this.optionList.length > 0) {
            this.optionList.forEach((ele, i) => {
              const opt = this.QAFormGroup.get('options') as UntypedFormArray;
              opt.push(this.initOptionForm());
              const frmGroup = opt.controls[i] as UntypedFormGroup;
              let editList: any[] = [];
              if ((ele.subDetail && ele.subDetail.length > 0) || ele.subDetail !== null) {
                ele.subDetail.forEach((element) => {
                  const subEditList = element;
                  const dataList = this.subDetails.filter(x => x.lookUpName === subEditList.lookUpName);
                  if (dataList.length > 0) {
                    dataList[0].loggedIn = element.subDetTransId;
                    editList.push(dataList[0]);
                  }
                });
                frmGroup.get('subDetail')?.setValue(editList);
              }
              frmGroup.get('answerName')?.setValue(ele.optionName);
              frmGroup.get('answerId')?.setValue(ele.answerId);
              frmGroup.get('optionId')?.setValue(ele.optionId);
              frmGroup.get('optionName')?.setValue(ele.optionName);
              frmGroup.get('progressBarValue')?.setValue(ele.progressBarValue);
              frmGroup.get('detAvailable')?.setValue(ele.detAvailable);
              frmGroup.get('subDetId')?.setValue(ele.subDetId);
              frmGroup.get('active')?.setValue(true);
              frmGroup.get('displayOrder')?.setValue(ele.displayOrder);
            });
            (this.QAFormGroup.get('options') as UntypedFormArray).controls.pop();
          }
        }
      }
      this.addFlag = false;
      this.breadcrumbFlags = this.common.breadcrumbFlags();
      this.breadcrumbFlags.btnResetTbl = false;
      this.breadcrumbFlags.btnAdd = false;
      this.breadcrumbFlags.btnSave = true;
      this.breadcrumbFlags.btnReset = true;
      this.breadcrumbFlags.btnBack = true;
      this.showFlag = true;
    } else {
      this.showTopCenter('warn', 'Alert Message', 'It does not contain Answers');
    }
  }
  closeForm() {
    this.tabIndex = 0;
    this.qaCheckFlag.setValue(true);
    this.showFlag = false;
    this.addFlag = true;
    this.getQASubdetail();
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
    this.QAFormGroup.reset();
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
    if (this.QAList.length > 0) {
      this.itemperpage = this.QAList.length;
    }
  }
}
