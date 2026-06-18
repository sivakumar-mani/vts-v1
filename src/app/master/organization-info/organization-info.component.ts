import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { orgInfoFlags } from 'src/app/common-methods/models/orgInfoFlags';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'


@Component({
  standalone: false,
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.css']
})
export class OrganizationInfoComponent implements OnInit {
  itemperpage;
  orgnzFlags = new orgInfoFlags();
  screenAuth: any = {};
  showFlag = false;
  displayedColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'organizationName', header: 'Organization Name' },
    { field: 'cinNo', header: 'CIN Number' },
    { field: 'panNo', header: 'Pan NO' }
  ];



  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
  orgComponentList: any[] = [];
  signatureTypeList: any[] = [];
  isEdit = false;
  isView = false;
  organizationFormGroup: UntypedFormGroup;
  addList = new BehaviorSubject(null);
  userData: any;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  data: any;
  dialogRef: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  imgType = [
    { value: 'Banner Logo 1', isDisable: false },
    { value: 'Banner Logo 2', isDisable: false },
    { value: 'Left Logo', isDisable: false },
    { value: 'Right Logo', isDisable: false },
    { value: 'Seal', isDisable: false },
    { value: 'Signature', isDisable: false }
  ];
  signatureDrpDwn = false;
  signatureDrpDwnDtl = false;
  fileArray: OrganizationDocument[] = [
    { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 1', isReq: '*' },
    { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 2', isReq: '' },
    { docId: 0, fileName: '', document: '', fileType: 'Left Logo', isReq: '' },
    { docId: 0, fileName: '', document: '', fileType: 'Right Logo', isReq: '' },
    { docId: 0, fileName: '', document: '', fileType: 'Seal', isReq: '*' }
  ];
  signatureArray: any;
  routePath = 'Configure / Organization Information';
  clientControls!: AutoCompleteDropDown;
  clientlst: any[] = [];

  // tslint:disable-next-line: max-line-length
  constructor(public common: CommonService, private titleService: Title, private masterService: MasterService, private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog, private cd: ChangeDetectorRef, private router: Router, ) { }

  ngOnInit() {
    // this.titleService.setTitle( 'Organization Information' );
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.orgnzFlags = this.common.orgInfoScreenFlag(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getOrgCompList();
    this.initFormGroup();
    this.itemperpage = 10
  }

  initFormGroup() {
    this.organizationFormGroup = this.fb.group({
      organizationId: [0],
      clientId: ['', Validators.required],
      organizationName: ['', Validators.required],
      organizationUrl: ['', Validators.required],
      webSiteName: ['', Validators.required],
      bannarLogo1Id: [0],
      bannarLogo1IsDeleted: [false],
      bannarLogo2Id: [0],
      bannarLogo2IsDeleted: [false],
      leftLogoId: [0],
      leftLogoIsDeleted: [false],
      rightLogoId: [0],
      rightLogoIsDeleted: [false],
      sealId: [0],
      sealIsDeleted: [false],
      // tslint:disable-next-line: max-line-length
      gstNo: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)])],
      // tslint:disable-next-line: max-line-length
      panNo: ['', Validators.compose([Validators.required, Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/), Validators.maxLength(10)])],
      // tslint:disable-next-line: max-line-length
      cinNo: ['', Validators.compose([Validators.required, Validators.pattern(/^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/)])],
      //  ['', Validators.required],
      faxNo: ['', Validators.compose([Validators.pattern(/^[0-9 +-]*$/), Validators.minLength(10)])],
      email1: ['', Validators.compose([Validators.required, Validators.pattern(this.common.EmailRegX),
      Validators.minLength(1)])],
      email2: ['', Validators.compose([Validators.pattern(this.common.EmailRegX),
      Validators.minLength(1)])],
      addressId: [1, Validators.required],
      createdUserId: [this.userData.userId],
      docType: [null],
      supportingDocument: [''],
      signatureDocument: [''],
      signatureLookUpId: [''],
      signDoc: this.fb.array([]),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        districtId: new UntypedFormControl(''),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        active: new UntypedFormControl(true),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(''),
        state: new UntypedFormControl(''),
        district: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        place: new UntypedFormControl(''),
      })
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlst,
        '', this.organizationFormGroup, false, false, true);

    this.organizationFormGroup.controls.supportingDocument.disable();
    this.imgType = [
      { value: 'Banner Logo 1', isDisable: false },
      { value: 'Banner Logo 2', isDisable: false },
      { value: 'Left Logo', isDisable: false },
      { value: 'Right Logo', isDisable: false },
      { value: 'Seal', isDisable: false },
      { value: 'Signature', isDisable: false }
    ];
    this.fileArray = [
      { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 1', isReq: '*' },
      { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 2', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Left Logo', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Right Logo', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Seal', isReq: '*' }
    ];
    this.signatureDrpDwn = false;
    this.signatureDrpDwnDtl = false;
    if (this.signatureArray) {
      for (const sign of this.signatureArray) {
        if (sign) {
          sign.signatureDocId = 0;
          sign.signatureId = 0;
          sign.signatureLookUpId = sign.lookUpId;
          sign.fileName = '';
          sign.document = '';
          sign.signatureType = sign.lookUpName;
          sign.isReq = '';
          sign.disabled = false;
        }
      }
    }
    this.isView = false;
  }
  getOrgCompList() {
    this.masterService.getAllOrganizationInfo().subscribe(res => {
      this.orgComponentList = res;
    });
    this.masterService.getOrgnzLokupData().subscribe(res => {
      this.signatureTypeList = res.signature;
      this.signatureArray = this.signatureTypeList;
      for (const sign of this.signatureArray) {
        if (sign) {
          sign.signatureDocId = 0;
          sign.signatureId = 0;
          sign.signatureLookUpId = sign.lookUpId;
          sign.fileName = '';
          sign.document = '';
          sign.signatureType = sign.lookUpName;
          sign.isReq = '';
          sign.disabled = false;
        }
      }
      this.clientlst = res.clientList;
      this.clientControls =
        new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlst,
          '', this.organizationFormGroup, false, false, true);
    });

  }
  chkClientName() {
    const clntId = this.organizationFormGroup.controls.clientId.value;
    if (clntId || clntId === 0) {
      const x = this.orgComponentList.filter(e => e.clientId === clntId);
      if (x.length !== 0) {
        this.organizationFormGroup.controls.clientId.setErrors({ incorrect: true });
        this.organizationFormGroup.controls.clientId.reset('');
        this.showTopCenter('warn', 'Failure Message', 'Client name already exist');
      }
    }
  }
  chkOrgName() {
    const orgName = this.organizationFormGroup.controls.organizationName.value.toUpperCase().replace(/\s/g, '');
    const x = this.orgComponentList.filter(e => e.organizationName.toUpperCase().replace(/\s/g, '') === orgName);
    if (x.length !== 0) {
      this.organizationFormGroup.controls.organizationName.setErrors({ incorrect: true });
      // this.organizationFormGroup.controls['organizationName'].reset('');
      this.showTopCenter('warn', 'Failure Message', 'Organization name already exist');
    }
  }

  checkValidation(cntrl: any) {
    if (cntrl === 'gst') {
      if (this.organizationFormGroup.controls.gstNo.value === '99XXXXX9999X9X9') {
        this.organizationFormGroup.controls.gstNo.reset('');
        this.showTopCenter('warn', 'Failure Message', 'Not a valid GST no');
      }
    }
    if (cntrl === 'pan') {
      if (this.organizationFormGroup.controls.panNo.value === 'XXXXX9999X') {
        this.organizationFormGroup.controls.panNo.reset('');
        this.showTopCenter('warn', 'Failure Message', 'Not a valid PAN no');
      }
    }
    if (cntrl === 'cin') {
      if (this.organizationFormGroup.controls.cinNo.value === 'U99999XX9999XXX999999') {
        this.organizationFormGroup.controls.cinNo.reset('');
        this.showTopCenter('warn', 'Failure Message', 'Not a valid CIN no');
      }
    }
  }
  addOrganization() {
    this.initFormGroup();
    this.orgnzFlags.toolTip = 'Save';
    this.orgnzFlags = this.common.orgInfoScreenFlag();
    this.showFlag = !this.showFlag;
    this.imgType = [
      { value: 'Banner Logo 1', isDisable: false },
      { value: 'Banner Logo 2', isDisable: false },
      { value: 'Left Logo', isDisable: false },
      { value: 'Right Logo', isDisable: false },
      { value: 'Seal', isDisable: false },
      { value: 'Signature', isDisable: false }
    ];
    this.fileArray = [
      { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 1', isReq: '*' },
      { docId: 0, fileName: '', document: '', fileType: 'Banner Logo 2', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Left Logo', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Right Logo', isReq: '' },
      { docId: 0, fileName: '', document: '', fileType: 'Seal', isReq: '*' }
    ];
    for (const sign of this.signatureArray) {
      if (sign) {
        sign.signatureDocId = 0;
        sign.signatureId = 0;
        sign.signatureLookUpId = sign.lookUpId;
        sign.fileName = '';
        sign.document = '';
        sign.signatureType = sign.lookUpName;
        sign.isReq = '';
        sign.disabled = false;
      }
    }
  }
  closeForm() {
    this.orgnzFlags.btnSave = true;
    this.orgnzFlags.btnReset = true;
    this.orgnzFlags = this.common.orgInfoScreenFlag();
    this.organizationFormGroup.reset();
    this.addList = new BehaviorSubject(null);
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  resetForm() {
    const editOrganizationID = this.organizationFormGroup.controls.organizationId.value;
    // tslint:disable-next-line: no-string-literal
    const editAddressID = this.organizationFormGroup.get('address')['controls'].addressId.value;
    this.organizationFormGroup.controls.organizationId.setValue(0);
    this.organizationFormGroup.reset();
    this.addList = new BehaviorSubject(null);
    this.organizationFormGroup.markAsPristine();
    this.initFormGroup();
    if (this.isEdit) {
      this.organizationFormGroup.controls.organizationId.setValue(editOrganizationID);
      // tslint:disable-next-line: no-string-literal
      this.organizationFormGroup.get('address')['controls'].addressId.setValue(editAddressID);
    }
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  editDetail(src, mode: any) {
    this.initFormGroup();
    this.orgnzFlags = this.common.orgInfoScreenFlag();
    this.orgnzFlags.toolTip = 'Update';
    this.masterService.editOrgInfo(src.organizationId).subscribe(resp => {
      if (resp) {
        this.organizationFormGroup.patchValue(resp);
        this.organizationFormGroup.controls.createdUserId.setValue(this.userData.userId);
        if (Number(resp.bannarLogo1Id) !== 0) {
          this.fileArray[0].document = resp.bannarLogo1Doc;
          this.fileArray[0].docId = Number(resp.bannarLogo1Id);
          this.fileArray[0].fileName = resp.bannarLogo1FileName;
          // resp.organizationName + '_' + 'BannerLogo1.png';
          this.imgType[0].isDisable = true;
        }
        if (Number(resp.bannarLogo2Id) !== 0) {
          this.fileArray[1].document = resp.bannarLogo2Doc;
          this.fileArray[1].docId = Number(resp.bannarLogo2Id);
          this.fileArray[1].fileName = resp.bannarLogo2FileName;
          // resp.organizationName + '_' + 'BannerLogo2.png';
          this.imgType[1].isDisable = true;
        }
        if (Number(resp.leftLogoId) !== 0) {
          this.fileArray[2].document = resp.leftLogoDoc;
          this.fileArray[2].docId = Number(resp.leftLogoId);
          this.fileArray[2].fileName = resp.leftLogoFileName;
          // resp.organizationName + '_' + 'LeftLogo.png';
          this.imgType[2].isDisable = true;
        }
        if (Number(resp.rightLogoId) !== 0) {
          this.fileArray[3].document = resp.rightLogoDoc;
          this.fileArray[3].docId = Number(resp.rightLogoId);
          this.fileArray[3].fileName = resp.rightLogoFileName;
          // resp.organizationName + '_' + 'RightLogo.png';
          this.imgType[3].isDisable = true;
        }
        if (Number(resp.sealId) !== 0) {
          this.fileArray[4].document = resp.sealDoc;
          this.fileArray[4].docId = Number(resp.sealId);
          this.fileArray[4].fileName = resp.sealFileName;
          //  resp.organizationName + '_' + 'Seal.png';
          this.imgType[4].isDisable = true;
        }
        const respSignArray = resp.signDoc;
        if (respSignArray != null && respSignArray !== undefined && respSignArray.length !== 0) {
          this.signatureDrpDwn = true;
          this.signatureDrpDwnDtl = true;
          this.organizationFormGroup.controls.signatureDocument.disable();
          this.organizationFormGroup.controls.signatureLookUpId.reset('');
          for (const respSign of respSignArray) {
            let idx = 0;
            idx = this.signatureArray.findIndex(b => b.lookUpId === respSign.signatureLookUpId);
            this.signatureArray[idx].signatureDocId = respSign.signatureDocId;
            this.signatureArray[idx].signatureId = respSign.signatureId;
            this.signatureArray[idx].signatureLookUpId = respSign.signatureLookUpId;
            this.signatureArray[idx].fileName = respSign.signatureFileName;
            // this.signatureArray[idx].lookUpName + '_' + 'Signature.png';
            this.signatureArray[idx].document = respSign.signatureDoc;
            this.signatureTypeList[idx].disabled = true;
          }
        }
        const orgRawValue = this.organizationFormGroup.getRawValue();
        this.addList.next(orgRawValue.address);
        this.cd.markForCheck();
        if (mode === 'view') {
          this.orgnzFlags.btnSave = false;
          this.orgnzFlags.btnReset = false;
          // this.orgnzFlags = this.common.orgInfoScreenFlag();
          this.organizationFormGroup.disable();
          this.isView = true;
        }

        // this.organizationFormGroup.get('address')['controls'].stateId.disable();
        // this.organizationFormGroup.get('address')['controls'].state.disable();
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
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
  saveOrgInfoComponents() {
    if (!this.organizationFormGroup.valid) {
      return;
    }
    const bannarLogo1 = this.fileArray.filter(x => x.fileType === 'Banner Logo 1')[0].fileName;
    const seal = this.fileArray.filter(x => x.fileType === 'Seal')[0].fileName;
    if (bannarLogo1 === '') {
      this.showTopCenter('warn', 'Failure Message', 'Banner LOGO 1 document is required');
      return;
    }
    if (seal === '') {
      this.showTopCenter('warn', 'Failure Message', 'Seal document is required');
      return;
    }
    const orgFormData = new FormData();

    if (this.fileArray) {
      for (const file of this.fileArray) {
        if (file.fileName) {
          orgFormData.append(file.fileType, file.document);
        }
      }
    }
    if (this.signatureArray) {
      for (const sign of this.signatureArray) {
        if (sign.fileName) {
          orgFormData.append(sign.signatureType + '-' + sign.signatureLookUpId, sign.document);
        }
      }
    }

    orgFormData.append('orgEntry', JSON.stringify(this.organizationFormGroup.value));
    orgFormData.append('sigColl', JSON.stringify(this.signatureArray));
    this.masterService.saveOrgDetails(orgFormData).subscribe(res => {
      if (res) {
        if (this.isEdit) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.isEdit = false;
        } else {
          this.showTopCenter('success', 'Success Message', 'Saved Successfully');
        }
        this.getOrgCompList();
        this.closeForm();
      }
      if (!res) {
        this.showTopCenter('warn', 'Failure Message', 'Failed to save');
      }
    });
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  deleteOrgnztn() {
    this.masterService.deleteOrgnzDetails(this.data.organizationId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getOrgCompList();
      }
    });
  }

  reminderChange(type, ind) {
    if (type === 'Signature') {
      this.signatureDrpDwn = true;
      this.signatureDrpDwnDtl = true;
      this.organizationFormGroup.controls.signatureDocument.disable();
      this.organizationFormGroup.controls.signatureDocument.reset('');
      this.organizationFormGroup.controls.signatureLookUpId.reset('');
    } else {
      this.signatureDrpDwn = false;
      if (!this.isEdit) {
        this.signatureDrpDwnDtl = false;
      }
      if (type !== null && type !== undefined) {
        this.organizationFormGroup.controls.supportingDocument.enable();
      } else {
        this.organizationFormGroup.controls.supportingDocument.disable();
      }
    }
  }
  reminderSignChange(type, ind) {
    if (type !== null && type !== undefined) {
      this.organizationFormGroup.controls.signatureDocument.enable();
    } else {
      this.organizationFormGroup.controls.signatureDocument.disable();
    }
  }






  openUploadDoc(event, docType) {
    if (docType === 'document') {
      const indx = this.fileArray.findIndex(x => x.fileType === this.organizationFormGroup.controls.docType.value);
      for (const file of event.target.files) {
        if (file) {
          const fileName = file.name;
          const document = file;
          const fileType = this.organizationFormGroup.controls.docType.value;

          if (this.fileArray.filter(x => x.fileName === fileName).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'File already exists');
          } else {
            this.fileArray[indx].fileName = fileName;
            this.fileArray[indx].document = document;
            this.imgType[indx].isDisable = true;
            this.organizationFormGroup.controls.docType.reset(null);
            this.organizationFormGroup.controls.supportingDocument.disable();
            if (this.isEdit && this.fileArray[indx].docId < 0) {
              if (indx === 0) { this.organizationFormGroup.controls.bannarLogo1IsDeleted.reset(false); }
              if (indx === 1) { this.organizationFormGroup.controls.bannarLogo2IsDeleted.reset(false); }
              if (indx === 2) { this.organizationFormGroup.controls.leftLogoIsDeleted.reset(false); }
              if (indx === 3) { this.organizationFormGroup.controls.rightLogoIsDeleted.reset(false); }
              if (indx === 4) { this.organizationFormGroup.controls.sealIsDeleted.reset(false); }
            }
          }
        }
      }
    }
    if (docType === 'signature') {
      const indx = this.signatureArray.findIndex(x => x.lookUpId === this.organizationFormGroup.controls.signatureLookUpId.value);
      for (const file of event.target.files) {
        if (file) {
          const fileName = file.name;
          const document = file;
          const fileType = this.signatureArray[indx].signatureType;

          if (this.signatureArray.filter(x => x.fileName === fileName).length > 0) {
            this.showTopCenter('warn', 'Failure Message', 'File already exists');
          } else {
            this.signatureArray[indx].fileName = fileName;
            this.signatureArray[indx].document = document;
            this.signatureTypeList[indx].disabled = true;
            this.organizationFormGroup.controls.signatureLookUpId.reset('');
            this.organizationFormGroup.controls.signatureDocument.disable();
          }
        }
      }
    }
  }

  removeDocument(index: any) {
    // this.fileArray.splice(index, 1);
    this.fileArray[index].fileName = '';
    this.fileArray[index].document = '';
    this.imgType[index].isDisable = false;
    this.organizationFormGroup.controls.docType.reset(null);
    this.organizationFormGroup.controls.supportingDocument.disable();
    if (this.isEdit && this.fileArray[index].docId < 0) {
      if (index === 0) { this.organizationFormGroup.controls.bannarLogo1IsDeleted.reset(true); }
      if (index === 1) { this.organizationFormGroup.controls.bannarLogo2IsDeleted.reset(true); }
      if (index === 2) { this.organizationFormGroup.controls.leftLogoIsDeleted.reset(true); }
      if (index === 3) { this.organizationFormGroup.controls.rightLogoIsDeleted.reset(true); }
      if (index === 4) { this.organizationFormGroup.controls.sealIsDeleted.reset(true); }
    }
  }


  removeSignDocument(index: any) {
    // this.fileArray.splice(index, 1);
    this.signatureArray[index].fileName = '';
    this.signatureArray[index].document = '';
    this.signatureTypeList[index].disabled = false;
    this.organizationFormGroup.controls.signatureLookUpId.reset('');
    this.organizationFormGroup.controls.signatureDocument.disable();
  }
  downloadFile(data, filename, docId) {
    if (docId > 0) {
      if (data.document) {
        const sampleArr = this.base64ToArrayBuffer(data.document);
        this.saveByteArray(filename, sampleArr);
      } else {
        alert('file does not exists');
      }
      // });
    } else {
      const blob = new Blob([data.document], { type: 'application/octet-stream' });
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
        (window.navigator as any).msSaveOrOpenBlob(blob, filename);
      } else { // for Non-IE (chrome, firefox etc.)
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display:none;');
        const csvUrl = URL.createObjectURL(blob);
        a.href = csvUrl;
        a.download = filename;
        a.click();
        a.remove();
      }
    }
  }

  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else { // for Non-IE (chrome, firefox etc.)
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  showall() {
    if (this.orgComponentList.length > 0) {
      this.itemperpage = this.orgComponentList.length;
    }
  }
}



export class OrganizationDocument {
  docId;
  fileName: string;
  document;
  fileType;
  isReq;
}
