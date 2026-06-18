import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ScreeningService } from '../common-methods/services/screening.service';
import { CommonService } from '../common-methods/services/common.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-direct-app-candidate-insuff',
  templateUrl: './direct-app-candidate-insuff.component.html',
  styleUrls: ['./direct-app-candidate-insuff.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DirectAppCandidateInsuffComponent implements OnInit {
  ScrenningComid: any;
  InsuffRemark: any;
  InsufLevel: any;
  RequiredType: any;
  InsuffID: any;
  clearInsuffContent = new ClearInsuff();
  docFlag: boolean = false;
  insRemarks: string;
  //userData: any;
  InsuffStatus: any;
  @ViewChild('sucessAlert', { static: true }) sucessAlert!: TemplateRef<any>;
  @ViewChild('filesSizePopUp', { static: true }) filesSizePopUp;
  remarkForm: UntypedFormGroup;
  headerText: string;
  bodyText: any;
  messageText1: string;
  docErrorList: any[] = [];
  CandUserID: any;
  
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private screeningService : ScreeningService,
    public common: CommonService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getUrl();
    //this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getDirectAppInsuffDetails();
    this.initCommentForm()
  }
  getUrl() {
    this.route.queryParams.subscribe(par => {
      this.ScrenningComid = par.screeningCompId
    })
  }
  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass]
    });
  }
  getDirectAppInsuffDetails(){
    this.authService.getDirectAppInsuffDetails(this.ScrenningComid).subscribe(data => { 
      if (data === null || data === 0 || data === undefined) {
        const Bodytext = 'Already Insufficiency has been Cleared.';
        this.alert(Bodytext)
      }
      else if(data.inusuffStatus !== 'Raised'){
       if(data.inusuffStatus !== 'Submitted'){
        const Bodytext = 'The request is already process';
        this.alert(Bodytext)
       }
       else{
        const Bodytext = 'The request is already submitted';
        this.alert(Bodytext)
       }
      }
      if (data != null) {
        this.InsuffRemark = data.insuffRemark;
        this.InsufLevel = data.levels;
        this.RequiredType = data.requirmentType;
        this.InsuffID = data.insuffId;
        this.InsuffStatus = data.inusuffStatus;
        this.CandUserID = data.candUserID;
      }
    });
  }
  alert(bodytext: any) {
    this.headerText = 'Alert';
    this.bodyText = bodytext;
    this.dialog.open(this.sucessAlert, {
      width: '320px',
      disableClose: true
    });
  }
  dialogClose() {
    this.dialog.closeAll();
    this.router.navigate(['/'])
  }
  initCommentForm() {
    this.remarkForm = new UntypedFormGroup({
      Remark: new UntypedFormControl(null)
    });
  }
  //Start :- file-upload 
  openUploadDoc(event: any) {
    
    const fileSizeInBytes = event.target.files[0].size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB
    const formattedSize = fileSizeInMB.toFixed(2);
    if(parseFloat(formattedSize) > 5 ){
      //alert("The maximum size of one document in 5 MB ")
      this.showSnackbar('The maximum size of one document in 5 MB.', 'warning-snackbar');
     
      return;
    }
    const fileDetails = {
      fileName: event.target.files[0].name,
      fileSize: formattedSize,
    };
    this.docErrorList.push(fileDetails);
    let totalfileSize = 0;  totalfileSize = this.sum(this.docErrorList);
    if (totalfileSize > 150) {
      this.headerText = 'Confirmation !',
      this.messageText1 = 'The overall file size exceeds 150 MB, please do reupload files within 150 MB';            
      this.openDialogAlert1();
      
       this.docErrorList.pop();
      // this.docName = '';
      return;
    }
    const ext = (event.target.files[0].name.split('.').pop()).toLowerCase();
    if (ext === 'eml' || ext === 'pst' || ext === 'txt' || ext === 'pdf' || ext === 'docx' || ext === 'doc'
      || ext === 'xps' || ext === 'xlsx' || ext === 'xls' || ext === 'xlsb' || ext === 'xlsm'
      || ext === 'png' || ext === 'jpg' || ext === '.JPG' || ext === 'jpeg' || ext === 'gif' || ext === 'psd' || ext === 'tiff'
      || ext === 'eps' || ext === 'raw' || ext === 'msg') {
      const val = this.common.INFO_REQ;
      const SD = new ScreeningDocument();
      SD.fileName = event.target.files[0].name;
      SD.document1 = event.target.files[0];
      SD.screeningDocId = 0;
      SD.filePath = '';
      SD.docTypeId =  0;
      SD.docTypeName =  val;
      SD.docSubTypeId = 0;
      SD.insuffDocTransId = 0;
      if (this.clearInsuffContent.insuffDocument.length > 0) {
        this.clearInsuffContent.insuffDocument.forEach(e => {
          if (e.fileName === SD.fileName && e.docTypeId === SD.docTypeId) {
            this.docFlag = true;
          }
        });
        if (this.docFlag === false) {
          this.clearInsuffContent.insuffDocument.push(SD);
          this.docFlag = false;
        } else {
        
         this.showSnackbar('This File Already Exist.', 'warning-snackbar');
        // alert('This File Already Exist');
          this.docFlag = false;
        }
      } else {
        this.clearInsuffContent.insuffDocument = [];
        this.clearInsuffContent.insuffDocument.push(SD);
      }
     
    } else {
      this.showSnackbar('Please upload a valid file,' + ' Acceptable file Formats : .eml, .pst, .txt, .pdf, .docx, .doc, .xps' +
        '' + ', .xlsx, .xls, .xlsb, .xlsm , .png, .jpg, .jpeg, .gif, .psd, .tiff, .eps, .raw, .msg', 'warning-snackbar');
      // this.showTopCenter('warn', 'Failure Message',
      //   'Please upload a valid file,' + ' Acceptable file Formats : .eml, .pst, .txt, .pdf, .docx, .doc, .xps' +
      //   '' + ', .xlsx, .xls, .xlsb, .xlsm , .png, .jpg, .jpeg, .gif, .psd, .tiff, .eps, .raw, .msg');
    }
   // this.getRemarkTemplate();
  }
  public sum(fileDetail: any[]) {
    let sumdata = fileDetail.reduce((acc, current) => acc + parseFloat(current.fileSize), 0);
    return sumdata;
  }
  public openDialogAlert1() {
    const dialogRef = this.dialog.open(this.filesSizePopUp, {
      width: '330px',
      disableClose: true
    });
  }
  removeDocument(index: any) {
    this.clearInsuffContent.insuffDocument.splice(index, 1);
    this.docErrorList.splice(index,1);
  }
  allowSameFileUpload(event: any): void {
    event.srcElement.value = '';
  }
  
  //End
  //Insuff Save
  AddDirectAppInsuffSumitted(){
    if(this.remarkForm.value.Remark === null ){
     // alert('Please fill the Remark');
      this.showSnackbar('Please fill the Remark.', 'warning-snackbar');
      return;
    }
    if(this.clearInsuffContent.insuffDocument.length === 0){
      //alert('Please Upload documents');
      this.showSnackbar('Please Upload documents.', 'warning-snackbar');
      return;
    }
    const dataClearInsuff: ClearInsuff[] = [{
      insufficiencyId: this.InsuffID,
      statusLookupId: 492,
      clearedDate: new Date(),
      ceaInitiationDate: new Date(),
      insuffDetail: {
        insuffDetailId :0,
        comments:this.remarkForm.controls.Remark.value,
        createdUserId: this.CandUserID,
        insuffDate: new Date(),
        insufficiencyId: this.InsuffID,
      },
      insuffDocument: this.clearInsuffContent.insuffDocument,
      createdUserId: this.CandUserID,
      insuffDocumentIds :[],
      verifierQueue: false,
      applicationId: 1
    }];
    const formData = new FormData();
    this.clearInsuffContent.insuffDocument.forEach((r, index) => {
      formData.append('InsuffClearDocument_' + index, r.document1);
    });
    formData.append('ClearInsuff', JSON.stringify(dataClearInsuff));

    this.screeningService.AddClearDirectAppClearInsuff(formData).subscribe(res => {
      if (res) {
        const Bodytext = 'Thank you for submitting the Candidate DirectApp Insufficiency details for background verification!';
        this.alert(Bodytext)
      }
    });
  }

  
}





class InsuffDetail {
  insuffDetailId: number;
  insufficiencyId: number;
  insuffDate?: Date;
  comments: string;
  createdUserId: number;
}
class ClearInsuff {
  insufficiencyId: number;
  statusLookupId: number;
  clearedDate: Date;
  ceaInitiationDate: Date;
  insuffDetail: InsuffDetail;
  insuffDocument: ScreeningDocument[] = [];
  createdUserId: number;
  insuffDocumentIds: number[] = [];
  verifierQueue: boolean;
  applicationId: number;
}
class ScreeningDocument {
  screeningDocId: number;
  fileName: string;
  filePath: string;
  docTypeId?: number;
  docTypeName: string;
  docSubTypeId: number;
  insuffDocTransId: number;
  infoReqFlag: boolean;
  document1;
}