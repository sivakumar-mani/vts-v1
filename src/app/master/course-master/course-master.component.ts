import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-course-master',
  templateUrl: './course-master.component.html',
  styleUrls: ['./course-master.component.css']
})
export class CourseMasterComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Institution / Course Master';
  screenAuth: any = {};
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  data: any;
  dialogRef: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;

  @ViewChild('degreTrigger', { static: true }) degreTrigger!: MatMenuTrigger;
  degreeShortFilteredOptions: Observable<string[]>;
  degreeControl = new UntypedFormControl();

  @ViewChild('majorTrigger', { static: true }) majorTrigger: MatMenuTrigger;
  majorSubjectFilteredOptions: Observable<string[]>;
  majorSubjectControl = new UntypedFormControl();

  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  showFlag = false;
  courseMasterForm: UntypedFormGroup;

  isEdit: boolean;
  degreeComponentList: any[] = [];
  displayColumns = [
    { field: 'degree', header: 'Degree Name' },
    { field: 'major', header: 'Major Subject' },
    { field: 'approveStatus', header: 'Approve Status' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];

  // tslint:disable-next-line: max-line-length
  constructor(private titleService: Title, public common: CommonService, private masterService: MasterService, private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog, private cd: ChangeDetectorRef,
    private router: Router, ) { }

  ngOnInit() {
    // this.titleService.setTitle('Course Creation Master');
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getDegreeList();
    this.itemperpage = 10;
  }
  getDegreeList() {
    this.masterService.getAllCourseInfo().subscribe(res => {
      if (res != null) {
        this.degreeComponentList = res;
        this.drugTblAutoFilters();
      }
    });
  }

  private drugTblAutoFilters(): void {
    this.degreeControl = new UntypedFormControl();
    this.majorSubjectControl = new UntypedFormControl();
    this.degreeShortFilteredOptions = this.degreeControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.degreeComponentList.map(x => x.degree).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.majorSubjectFilteredOptions = this.majorSubjectControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.degreeComponentList.map(x => x.major).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  initFormGroup() {
    this.courseMasterForm = this.fb.group({
      degreeId: new UntypedFormControl(0),
      degree: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z /.]*$/)])),
      // tslint:disable-next-line: max-line-length
      major: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z /.()]*$/)])),
      descr: new UntypedFormControl(''),
      active: new UntypedFormControl(false),
      createdUserId: new UntypedFormControl(this.userData.userId)
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

  addCourseMas() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.courseMasterForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editdegreeId = this.courseMasterForm.controls.degreeId.value;
    this.courseMasterForm.controls.degreeId.setValue(0);
    this.courseMasterForm.reset();
    this.courseMasterForm.markAsPristine();
    this.initFormGroup();
    if (this.isEdit) {
      this.courseMasterForm.controls.degreeId.setValue(editdegreeId);
    }
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.drugTblAutoFilters();
  }

  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  // activeChangeName(event: any) {
  //   if (event) {
  //     this.avtiveName = 'Is Active';
  //   }
  //   if (!event) {
  //     this.avtiveName = 'Is Not Active';
  //   }
  // }
  checkValidCourseName(field: any) {
    if (field === 'degree') {
      this.courseMasterForm.controls.major.reset('');
      return;
    }
    if (field === 'major') {
      const degreeName = this.courseMasterForm.controls.degree.value;
      if (degreeName === '' || degreeName === null || degreeName === undefined) {
        this.showTopCenter('warn', 'Failure Message', 'Please fill Course Name');
        this.courseMasterForm.controls.major.reset('');
        return;
      }
      const x = this.degreeComponentList.filter(e => e.degree.toUpperCase().replace(/\s/g, '') === degreeName.replace(/\s/g, ''));
      if (x.length !== 0) {
        // tslint:disable-next-line: max-line-length
        const res = x.filter(z => z.major.toUpperCase().replace(/\s/g, '') === this.courseMasterForm.controls.major.value.replace(/\s/g, ''));
        if (res.length !== 0) {
          this.courseMasterForm.controls.major.setErrors({ incorrect: true });
        }
      }
    }
  }
  editCourseMas(data: any, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.courseMasterForm.patchValue(data);
    this.courseMasterForm.controls.createdUserId.setValue(this.userData.userId);
    // this.activeChangeName(data.active);
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.courseMasterForm.disable();
    }
  }
  saveCourseMaster() {
    if (this.courseMasterForm.valid) {
      this.masterService.saveCourseDetails(this.courseMasterForm.getRawValue()).subscribe(res => {
        if (res) {
          if (this.isEdit) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getDegreeList();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.courseMasterForm.markAllAsTouched();
    }
  }
  deleteCourseMaster() {
    this.masterService.deleteCourse(this.data.degreeId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getDegreeList();
      }
    });
  }
  showall() {
    if (this.degreeComponentList.length > 0) {
      this.itemperpage = this.degreeComponentList.length;
    }
  }
}
