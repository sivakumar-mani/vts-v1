import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
@Component({
  standalone: false,
  selector: 'app-annexure-check',
  templateUrl: './annexure-check.component.html',
  styleUrls: ['./annexure-check.component.css']
})
export class AnnexureCheckComponent implements OnInit {
  annexureForm: UntypedFormGroup;
  recordCheckList: any[] = [];
  annexureList: any[] = [];
  annexureCategoryList: any[] = [];
  recordCategoryList: any[] = [];
  statusList: any[] = [];
  uploadphoto: any
  myReader: FileReader = new FileReader();

  imagePreview;
  file: any
  deleteFlag = false
  @Input() clientId: string;
  @Input() responseDoc: any;
  @Input() formGroup: UntypedFormGroup;
  displayedColumns = [
    { field: 'recordCheckName', header: 'Record Check' },
    { field: 'recordCheckCategoryName', header: 'Record Check Category' },
    { field: 'statusLookUpName', header: 'Status' },
    { field: 'remarks', header: 'Remarks' },
    // { field: 'imageUpload', header: 'Image' },
    { field: 'action', header: 'Action' }
  ];
  displayedColumns1 = [
    { field: 'recordCheckName', header: 'Record Check' },
    { field: 'recordCheckCategoryName', header: 'Record Check Category' },
    { field: 'statusLookUpName', header: 'Status' },
    { field: 'remarks', header: 'Remarks' },
    // { field: 'imageUpload', header: 'Image' },
  ];

  userData = new User();
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  editFlag = false;
  dataIndex = -1;
  dupRecordCatList: any[] = [];
  @Input() generateFlag = false;
  tooltip = 'Add';
  annexureFlag = false;
  fileName: any;
  closedFlag = false;
  constructor(private verification: VerificationService, private messageService: MessageService, private common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.closedFlag = this.verification.closedCheck;
    this.initFormGroup();
    this.getRecordCheckList();
    this.getCriminalStatusList();
    this.bindRecordCheckDetails();
    // if (this.formGroup.get('verificationResponseDocument.receivedResponseDocument')?.value.document.length > 0) {
    //   this.generateFlag = true;
    //   this.annexureForm.controls.recordCheckId.disable();
    //   this.annexureForm.controls.recordCheckCategory.disable();
    //   this.annexureForm.controls.statusLookupId.disable();
    //   this.annexureForm.controls.remarks.disable();
    // }
  }
  initFormGroup() {
    this.annexureForm = new UntypedFormGroup({
      screeningRecordCheckId: new UntypedFormControl(0),
      screeningCriminalDatabaseId: new UntypedFormControl(),
      recordCategoryName: new UntypedFormControl(''),
      recordCheckId: new UntypedFormControl('', Validators.required),
      recordCheckName: new UntypedFormControl(''),
      recordCheckCategory: new UntypedFormControl('', Validators.required),
      recordCheckCategoryName: new UntypedFormControl(''),
      statusLookupId: new UntypedFormControl('', Validators.required),
      statusLookUpName: new UntypedFormControl(''),
      loggedIn: new UntypedFormControl(this.userData.userId),
      remarks: new UntypedFormControl(''),
      // imageUpload: new UntypedFormControl(null)

    });
  }
  getRecordCheckList() {
    this.recordCheckList = [];
    this.verification.getRecordCheckList().subscribe(res => {
      if (res) {
        this.recordCheckList = res.splice(0, 8);
      }
    });
  }
  getRecordCategoryList(recordCheckId: number) {
    this.verification.getRecordCategoryList(recordCheckId, this.clientId).subscribe(res => {
      if (res) {
        this.recordCategoryList = Array.from(res.reduce((m, t) => m.set(t.recordCheckCategoryId, t), new Map()).values());;
        this.dupRecordCatList = this.common.CloneObject(this.recordCategoryList);
      }
    });
  }
  getCriminalStatusList() {
    this.verification.getCriminalComponentStatus().subscribe(res => {
      if (res) {
        this.statusList = res;
      }
    });
  }
  bindRecordCheckDetails() {
    const criminalDBId = this.responseDoc.component.applicantDetail.screeningCriminalDatabaseId;
    this.verification.getRecordCheckDetails(criminalDBId).subscribe(res => {
      if (res.length > 0) {
        res.forEach(element => {
          element.recordCheckCategoryName = element.recordCategoryName.map(x => x).join();
        });
        // const rcc = res.map(m => m.recordCategoryName).join();
        // res.recordCheckCategoryName = rcc;
        this.annexureCategoryList = res;

      }
      this.annexureCategoryList.length > 0 ? this.annexureFlag = true : this.annexureFlag = false;
    });
  }
  addAnnexure() {
    this.annexureForm.get('loggedIn')?.setValue(this.userData.userId)
    if (this.annexureForm.get('statusLookupId')?.valid) {
      const statusname = this.statusList.find(x => x.lookUpId ===
        this.annexureForm.get('statusLookupId')?.value).lookUpName;
      if (statusname === "No Record" || statusname === "N.A") {
        this.annexureForm.get('remarks')?.clearValidators()
        this.annexureForm.get('remarks')?.updateValueAndValidity()
      }
      else {
        this.annexureForm.get('remarks')?.setValidators(Validators.required)
        this.annexureForm.get('remarks')?.setErrors(Validators.required);
        this.annexureForm.get('remarks')?.updateValueAndValidity()
      }
    }
    else {
      this.annexureForm.setValidators(Validators.required)
    }
    if (this.annexureForm.valid) {
      let recordCheckCategoryName: any;
      const recordCheckName = this.recordCheckList.find(x => x.recordCheckId ===
        this.annexureForm.get('recordCheckId')?.value).recordCheckName;
      this.annexureForm.get('recordCheckName')?.setValue(recordCheckName);
      this.annexureForm.get('screeningRecordCheckId')?.value > 0 ? this.annexureForm.get('screeningRecordCheckId')?.value :
        this.annexureForm.get('screeningRecordCheckId')?.setValue(0);
      // const recordCheckCategoryList = this.recordCategoryList.filter(x => x.recordCheckCategoryId ===
      //   this.annexureForm.get('recordCheckCategoryId')?.value);
      if (this.annexureForm.get('recordCheckCategory')?.value.length > 0) {
        recordCheckCategoryName = this.annexureForm.get('recordCheckCategory')?.value.map(m => m.recordCheckCategoryName);
      }
      // const recordCheckCategoryName = this.recordCategoryList.find(x => x.recordCheckCategoryId ===
      //   this.annexureForm.get('recordCheckCategoryId')?.value).recordCheckCategoryName;

      this.annexureForm.get('recordCheckCategoryName')?.setValue(this.annexureForm.get('recordCheckCategory')?.value.map(m => m.recordCheckCategoryName).join());
      this.annexureForm.get('recordCategoryName')?.setValue(recordCheckCategoryName);
      const statusLookUpName = this.statusList.find(x => x.lookUpId ===
        this.annexureForm.get('statusLookupId')?.value).lookUpName;
      this.annexureForm.get('statusLookUpName')?.setValue(statusLookUpName);
      const recId = this.annexureForm.value.recordCheckCategory.map(m => m.recordCheckCategoryId);

      recId.length > 0 ? this.annexureForm.get('recordCheckCategory')?.setValue(recId) : [];

      const checkDup = this.annexureCategoryList.some((x, index) => this.dataIndex !== index &&
        x.recordCheckId === this.annexureForm.get('recordCheckId')?.value &&
        x.recordCheckCategory.toString() === this.annexureForm.get('recordCheckCategory')?.value.toString())

      if (!checkDup) {
        if (this.editFlag === false) {
          this.annexureCategoryList.push(this.annexureForm.value);
          this.showNotification('success', 'Success', 'Added Successfully');
        }
        else {
          this.annexureCategoryList.splice(this.dataIndex, 1, this.annexureForm.value);
          this.showNotification('success', 'Success', 'Updated Successfully');
        }
      } else {
        this.showNotification('warn', 'Failed', 'Already exists.');
      }

      this.resetAnnexure();

    } else {
      this.annexureForm.markAllAsTouched();
    }

  }
  editRecordCategory(data, index) {
    this.getRecordCategoryList(data.recordCheckId);
    // this.recordCategoryList = Object.assign([], this.dupRecordCatList);
    this.editFlag = true;
    this.dataIndex = index;
    setTimeout(() => {
      let checkList: any[] = [];
      data.recordCheckCategory.forEach(element => {
        const checkdata = this.recordCategoryList.filter(x => x.recordCheckCategoryId === element);
        checkList.push(checkdata[0]);
      });
      if (checkList.length > 0) {
        data.recordCheckCategory = checkList;
      }
      this.annexureForm.patchValue(data);
    }, 100);
    this.tooltip = 'update';
  }
  removeRecordCategory(index, removeData) {
    const recordList = this.annexureCategoryList.filter(f => f.screeningRecordCheckId === removeData.screeningRecordCheckId)
    this.annexureForm.get('loggedIn')?.setValue(this.userData.userId)
    const annexureList = []
    this.annexureCategoryList.splice(index, 1);
    annexureList.push(removeData)
    const criminalDBId = this.responseDoc.component.applicantDetail.screeningCriminalDatabaseId;
    let updateFlag = false;
    this.deleteFlag = true
    const val = {

      screeningCriminalDatabaseId: criminalDBId, recordCheckDetail: annexureList,
      loggedIn: this.userData.userId, updateFlag: updateFlag, deleteFlag: this.deleteFlag
    };

    // if()
    if (recordList != null) {
      this.verification.saveRecordCheckDetails(val).subscribe(res => {
        if (res) {

          //  this.annexureFlag = true;
          //  this.annexureForm.reset();
          if (res == true) {
            this.showNotification('success', 'Success', 'Deleted Successfully');
            this.bindRecordCheckDetails();
          }
          else {
            this.showNotification('warn', 'Failed', 'Something Went Wrong');
          }
          // if(this.annexureCategoryList.length>0){
          //   this.generateFlag=false
          // }
          // else
          // {
          //   this.generateFlag=true
          // }
        }
      });
    }
  }
  resetAnnexure() {
    this.annexureForm.get('recordCheckId')?.reset();
    this.annexureForm.get('recordCheckCategory')?.reset();
    this.annexureForm.get('statusLookupId')?.reset();
    this.annexureForm.get('remarks')?.reset();
    // this.annexureForm.get('imageUpload')?.reset();
    this.fileName = ''
    this.recordCategoryList = [];
    this.editFlag = false;
    this.dataIndex = -1;
    this.tooltip = 'Add';
  }
  saveRecordCheckDetails() {
    this.deleteFlag = false
    const criminalDBId = this.responseDoc.component.applicantDetail.screeningCriminalDatabaseId;
    this.annexureCategoryList.map(x => x.screeningCriminalDatabaseId = criminalDBId);
    let updateFlag = false;
    if (this.annexureCategoryList.length > 0) {
      updateFlag = this.annexureCategoryList.filter(x => x.screeningRecordCheckId > 0).length > 0;
    }
    const val = {
      screeningCriminalDatabaseId: criminalDBId, recordCheckDetail: this.annexureCategoryList,
      loggedIn: this.userData.userId, updateFlag: updateFlag, deleteFlag: this.deleteFlag
    };

    this.verification.saveRecordCheckDetails(val).subscribe(res => {
      if (res) {
        this.annexureFlag = true;
        this.bindRecordCheckDetails();
        this.annexureForm.reset();
        this.showNotification('success', 'Success', 'Saved Successfully');
      }
    });
  }
  generateAnnexure() {
    if (this.annexureCategoryList.length > 0 && this.annexureFlag === true) {
      const criminalDBId = this.responseDoc.component.applicantDetail.screeningCriminalDatabaseId;
      const screeningCompId = this.responseDoc.component.applicantDetail.screeningComponentId;
      const candidateName = this.responseDoc.component.applicantDetail.firstName +
        this.responseDoc.component.applicantDetail.middleName +
        this.responseDoc.component.applicantDetail.lastName;
      this.verification.generateAnnexure(this.clientId, screeningCompId, candidateName,
        criminalDBId, this.userData.userId).subscribe(resp => {
          if (resp) {
            this.getAnnexureDocument(screeningCompId, 'Generated');
            // this.generateFlag = true;
          }
        });
    } else {
      this.showNotification('warn', 'Alert', 'Add atleast max 1 categorylist');
    }
  }
  getAnnexureDocument(screeningCompId, msg) {
    this.verification.getAnnexureDocument(screeningCompId).subscribe(res => {
      if (res) {
        this.formGroup.get('verificationResponseDocument.receivedResponseDocument')?.patchValue(res);

        const a = this.formGroup.get('verificationResponseDocument.receivedResponseDocument.document') as UntypedFormArray;
        while (a.value.length !== 0) {
          a.removeAt(0);
        }
        res.document.forEach(element => {
          a.push(new UntypedFormControl(element));
        });
        if (msg === 'Deleted') {
          this.annexureForm.controls.recordCheckId.enable();
          this.annexureForm.controls.recordCheckCategory.enable();
          this.annexureForm.controls.statusLookupId.enable();
          this.annexureForm.controls.remarks.enable();
          this.formGroup
            .get('verificationResponseDocument.receivedResponseDocument')
            ?.patchValue({ document: [] });
          // this.formGroup.get('verificationResponseDocument.receivedResponseDocument')?.value.document: any[] = [];
        } else {
          this.annexureForm.controls.recordCheckId.disable();
          this.annexureForm.controls.recordCheckCategory.disable();
          this.annexureForm.controls.statusLookupId.disable();
          this.annexureForm.controls.remarks.disable();
        }
        this.showNotification('success', 'Success', 'Annexure ' + msg + ' Successfully');
      }
    });
  }
  deleteAnnexure() {
    const screeningCompId = this.responseDoc.component.applicantDetail.screeningComponentId;
    this.verification.deleteAnnexure(screeningCompId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.verification.getAnnexureDocument(screeningCompId).subscribe(res => {
          if (res) {
            this.getAnnexureDocument(screeningCompId, 'Deleted');
            // this.generateFlag = false;
          }
        });
      }
    });
  }
  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
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

  uploaphoto(fileInput: any) {
    if (fileInput != null) {
      this.fileName = fileInput.target.files[0].name;
      this.file = fileInput.target.files[0];
      if (this.file.size <= 2000000) {
        const img = this.file.name.split('.').pop();
        if (img === 'png' || img === 'PNG' || img === 'jpg' || img === 'JPG' || img === 'jpeg' || img === 'gif' || img === 'psd' || img === 'bmp') {

          this.read(this.file)


        }
        else {
          this.showNotification('warn', 'Failed', 'Please upload a valid file,' + ' Acceptable file Formats : .png, .jpg, .JPG, .jpeg, .gif, .psd, .bmp');
          this.fileName = ''
          fileInput.target.value = ''
        }
      }

      else {
        this.showNotification('warn', 'Failed', 'Please upload a smaller image, max size is 2 MB');
        this.fileName = ''
        fileInput.target.value = ''
      }
    }

  }
  removeImage() {
    this.fileName = ''
    this.file.target.value = ''
  }
  downloadFile(filename: any) {
    const sampleArr = this.common.convertBase64ToFileObj(this.imagePreview);
    this.common.saveByteArray(filename, sampleArr);
  }

  read(file): void {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {

      this.imagePreview = e.target.result;

      if (this.imagePreview === "" || this.imagePreview === null || this.imagePreview === undefined) {
        this.showNotification('warn', 'Failed', 'Image Upload Falid');
        this.fileName = ''
        this.file.target.value = ''
      }
      else {

        var data = this.imagePreview.replace(/^data:image\/[a-z]+;base64,/, "");
        this.annexureForm.get('imageUpload')?.setValue(data)

      }

    };

    // if(this.imagePreview==null){setTimeout(() => {
    //   reader.readAsDataURL(file);
    //   // this.myReader.onload=(e:any)=>{
    //   //   this.imagePreview = reader.result;
    //   // }
    // }, 3000);}


    // if (this.imagePreview == "" || this.imagePreview == undefined || this.imagePreview == null) {
    //   this.myReader.onload = () => {
    //     console.log(this.myReader.result);

    //     this.imagePreview = this.myReader.result as string;
    //   }
    //   this.myReader.readAsDataURL(this.file);
    // }
    // else {

    // }
  }

  viewImage(Encrypt: any) {
    const filename = Encrypt.substring(0, 15)
    const base64 = "data:image/jpeg;base64," + Encrypt
    const sampleArr = this.common.convertBase64ToFileObj(base64);
    this.common.saveByteArray(filename + ".jpg", sampleArr);
  }
}
