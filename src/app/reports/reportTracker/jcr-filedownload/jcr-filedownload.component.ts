import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { process } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  standalone: false,
  selector: 'app-jcr-filedownload',
  templateUrl: './jcr-filedownload.component.html',
  styleUrls: ['./jcr-filedownload.component.css']
})
export class JCRFileDownloadComponent implements OnInit {
  public gridView: any;
  public buttonCount = 7;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes = true;
  public previousNext = true;
  public skip = 0;
  itemPerPage;
  jcrfiledownloadForm: UntypedFormGroup;
  jcrfiledownloadlist: any[] = [];
  candidateList: any[] = [];
  screeningList: any[] = [];
  screeningNoControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  searchValueArr: any[] = [];
  displayColumns = [{ field: 'candidateName', header: 'Candidate Name' },
  { field: 'fileName', header: 'File Name' }, { field: 'screeningId', header: 'Screening Id' },
  { field: 'qcStatus', header: 'Qc Status' }];
  jcrfileCopylist: any[] = [];
  mySelection: any[] = [];
  searchText: any;
  constructor(public common: CommonService, private reportService: ReportService, private messageService: MessageService) { }
  ngOnInit() {
    this.initFormGroup();
    this.GetJCRFileDownload();
    this.itemPerPage = 15;
  }
  initFormGroup() {
    this.jcrfiledownloadForm = new UntypedFormGroup({
      candidateName: new UntypedFormControl(null),
      screeningId: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.screeningNoControl = new AutoCompleteDropDown('Screening Id', 'screeningId', 'screeningId', 'screeningId',
      this.screeningList, '', this.jcrfiledownloadForm, false, false, true, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateName',
      'candidateName', this.candidateList, '', this.jcrfiledownloadForm, false, false, true, 'standard');
  }
  resetfrom() {
    this.initFormGroup();
    this.GetJCRFileDownload();
  }
  public onFilter(inputValue: string): void {
    this.jcrfiledownloadlist = process(this.jcrfileCopylist, {
      filter: {
        logic: 'or', filters: [{
          field: 'candidateName', operator:
            'contains', value: inputValue
        }, { field: 'fileName', operator: 'contains', value: inputValue }, {
          field: 'screeningId',
          operator: 'contains', value: inputValue
        }, { field: 'qcStatus', operator: 'contains', value: inputValue }]
      }
    }).data;
    this.gridView = this.jcrfiledownloadlist;
  }
  searchValue() {
    if (this.jcrfiledownloadForm.valid) {
      this.jcrfiledownloadlist = this.jcrfileCopylist.filter(x => x.candidateName === this.jcrfiledownloadForm.value.candidateName &&
        x.screeningId === this.jcrfiledownloadForm.value.screeningId);
    } else {
      this.jcrfiledownloadForm.markAllAsTouched();
    }
  }
  GetJCRFileDownload() {
    this.reportService.GetJCRFileDownload().subscribe(res => {
      if (res) {
        res.forEach(ele => {
          ele.checked = false;
          ele.qcStatus = ele.qcStatus === true ? 'Yes' : 'No';
          if (ele.candidateName) {
            ele.candidateName = ele.candidateName.firstName.trimStart() ? (ele.candidateName.firstName + (ele.candidateName.middleName ?
              (' ' + ele.candidateName.middleName) : '') + (ele.candidateName.lastName ? (' ' + ele.candidateName.lastName) : '')) : 'N/A';
          }
        });
        this.jcrfileCopylist = this.common.CloneObject(res);
        this.jcrfiledownloadlist = res;
        this.candidateList = Array.from(new Map(this.jcrfiledownloadlist.map(x => ({ candidateName: x.candidateName })).
          filter(f => f.candidateName).map(e => [e.candidateName, e])).values());
        this.screeningList = Array.from(new Map(this.jcrfiledownloadlist.map(x => ({ screeningId: x.screeningId })).
          map(e => [e.screeningId, e])).values());
        this.initautoCompleteCtrl();
      }
      this.loadReport();
    });
  }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.jcrfiledownloadForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
        }
      }
    }
  }
  exportExcel() {
    const list = this.jcrfiledownloadlist.filter(x => x.checked === true);
    if (list.length > 0) {
      const zip = new JSZip();
      const rar = zip.folder('JCR');
      list.forEach(element => {
        rar.file(element.fileName, element.document, { base64: true });
      });
      zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver.saveAs(content, 'JCR.zip');
      });
      this.showTopCenter('success', 'Success Message', 'Downloaded Successfully ')
      this.GetJCRFileDownload();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please select record ')
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  showall() {
    if (this.jcrfiledownloadlist.length > 0) {
      this.itemPerPage = this.jcrfiledownloadlist.length;
      this.loadReport();
    }
  }
  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.itemPerPage = take;
    this.loadReport();
  }

  private loadReport(): void {
    this.gridView = {
      data: this.jcrfiledownloadlist.slice(this.skip, this.skip + this.itemPerPage),
      total: this.jcrfiledownloadlist.length
    };
  }
}
