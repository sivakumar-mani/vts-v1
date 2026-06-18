import { ChangeDetectorRef, Component, OnInit, OnChanges, Input, ViewChild, Output, EventEmitter, OnDestroy, SimpleChange, SimpleChanges, ElementRef } from '@angular/core';
import { UntypedFormControl, NgForm, Validators } from '@angular/forms';
import { CommonComponentVm, CaseComponentVm, CaseSubComponentVm, SaveScopeCreationVm } from 'src/app/common-methods/models/caseCreationView';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MessageService } from 'primeng/api';
// import { DataTable } from 'primeng/primeng';
// import { Observable, from } from 'rxjs';
// import { startWith, map } from 'rxjs/operators';
// import { MatMenuTrigger, MatSelect } from '@angular/material';
import { Table } from 'primeng/table';

import { Observable, from } from 'rxjs';

import { startWith, map } from 'rxjs/operators';

import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';

@Component({
  standalone: false,
  selector: 'app-additional-component',
  templateUrl: './additional-component.component.html',
  styleUrls: ['./additional-component.component.css']
})
export class AdditionalComponentComponent implements OnInit, OnDestroy, OnChanges {
  noList: { value: number; }[];
  @Input() getValues: CommonComponentVm;
  @Output() compToEmit = new EventEmitter<CommonComponentVm>();
  currencyControls: AutoCompleteDropDown;
  caseComponent: CaseComponentVm[];
  casecomponentlist = new CaseComponentVm();
  caseSubComponent: CaseSubComponentVm[];
  caseSubComponentlist = new CaseSubComponentVm();
  @ViewChild('dtable')
  dt!: Table;

  @ViewChild('invitetab')
  invitetab!: Table;

  @ViewChild('compfrm')
  compfrm!: NgForm;
  existItem: any;
  checkArray: any;
  totalpages: number;

  componentfilterList = [];
  filtersubcomplist = [];
  currencyList = [];
  componentListpackid = [];
  checkCompList = [];
  scopeComponentList = [];
  scopelist = [];

  checkCopy = false;
  subflag = false;
  tooltip = false;
  compflag = false;
  editFlag = false;

  currentPage = 1;
  tempCurrentPage = 1;
  editindex = -1;
  maxnoofcomp = 0;
  expandrows: any = {};
  scopecolumns = [
    { field: 'type', header: 'Type' },
    { field: 'componentType', header: 'Component Type' },
    { field: 'subCompName', header: 'Sub Component Type' },
    { field: 'noOfComponent', header: 'No of Component' },
    { field: 'currencyType', header: 'Currency' },
  ];
  invitecolumns = [
    { field: 'type', header: 'Type' },
    { field: 'componentType', header: 'Component Type' },
    { field: 'subCompName', header: 'Sub Component Type' },
    { field: 'price', header: 'Price' },
    { field: 'noOfComponent', header: 'No of Component' },
    // { field: 'currencyType', header: 'Currency' },
    { field: 'remarks', header: 'Remarks' },
  ];
  aditionalcompCol = [
    { field: 'ischecked', header: 'Select' },
    { field: 'compName', header: 'Component Name' },
    { field: 'currencyId', header: 'Currency' },
    { field: 'price', header: 'Price' },
    { field: 'noOfComponent', header: 'No of Comp' },
    { field: 'remarks', header: 'Remarks' }
  ];
  subcompCol = [
    { field: 'ischecked', header: 'Select' },
    { field: 'subCompName', header: 'Component Name' },
    { field: 'currencyId', header: 'Currency' },
    { field: 'price', header: 'Price' },
    { field: 'noOfComponent', header: 'No of Comp' },
    { field: 'remarks', header: 'Remarks' },
  ];
  countFlag!: boolean;

  packPrice = 0;

  compNameFilteredOptions!: Observable<string[]>;

  compNameControl = new UntypedFormControl();

  @ViewChild('compNameCtrlTrigger')
  compNameCtrlTrigger!: MatMenuTrigger;

  expctrl = new UntypedFormControl();
  constructor(public screeningService: ScreeningService, public common: CommonService,
    private agentEntryService: AgentEntryMasterService, private message: MessageService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getValues.compCommonLists = new SaveScopeCreationVm();
    this.getCurrencyList();
    this.genAutoCompleteFilter();
    this.scopeComponentList = this.getValues.componentList;
    // if (this.getValues.type === 'scope') {
    if (this.getValues.scopeList) {
      if (this.getValues.componentList) {
        this.getValues.componentList.map(m => {
          if (m.subCompFlag) {
            m.packageSubComponent.map(m1 => {
              m1.subCheckFlag = false;
              m1.remarks = '';
            });
          } else {
            m.subCheckFlag = false;
            m.remarks = '';
          }
        });
      }
      this.editFlag = true;
      this.validateinvitationCompList();
      if (this.getValues.scopeList.packageId !== 0) {
        this.packageName(this.getValues.scopeList.packageId);
      }
      this.scopelist = this.getValues.scopeList.caseComponent;
    } else {
      this.getValues.componentFormGroup.get('packageId').enable();
    }
    if (this.getValues.type === 'invitation') {
      this.aditionalcompCol = [{ field: 'ischecked', header: 'Select' },
      { field: 'compName', header: 'Component Name' },
      // { field: 'currencyId', header: 'Currency' },
      { field: 'price', header: 'Price' },
      { field: 'noOfComponent', header: 'No of Comp' },
      { field: 'daCompValidYear', header: 'No of Years' },
      { field: 'remarks', header: 'Remarks' }];
      this.subcompCol = [{ field: 'ischecked', header: 'Select' },
      { field: 'subCompName', header: 'Component Name' },
      // { field: 'currencyId', header: 'Currency' },
      { field: 'price', header: 'Price' },
      { field: 'noOfComponent', header: 'No of Comp' },
      { field: 'daCompValidYear', header: 'No of Years' },
      { field: 'remarks', header: 'Remarks' }]
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.getValues) {
      this.genrowExpandobj(this.getValues.componentList);
    }
  }
  checkEvent(e, data) {
    if (e === false) {
      data.noOfComponent = '';
      data.noofExp = '';
      data.remarks = '';
    } else {
      data.noOfComponent = 1;
    }
    Promise.resolve().then(() => this.cdr.detectChanges());
  }
  genrowExpandobj(complist) {
    complist.map(m => {
      if (m.subCompFlag) {
        const nm = m.compId;
        this.expandrows[nm] = true;
      }
    });
  }

  genAutoCompleteFilter() {
    let data = [];
    data = this.getValues.componentList;
    this.compNameFilteredOptions = this.compNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(data.map(x => x.compName).filter(x => x))).sort())
          .filter(x => x).sort().filter(f => f.toLowerCase().includes(value))));

  }
  getCurrencyList() {
    this.agentEntryService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currencyList = res;
        this.currencyList.forEach(element => {
          element.currencyShortName = element.countryName + ' - ' + element.currencyShortName;
        });
        this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
          '', this.getValues.componentFormGroup, false, false, false);
      }
    });
  }
  assignResourceCopy() {
    if (this.getValues.componentList || !this.getValues.componentList === undefined) {
      if (!this.checkCopy) {
        this.componentfilterList = Object.assign([], this.getValues.componentList);
      } else {
        this.componentfilterList = Object.assign([], this.checkCompList);
      }

    }
  }
  // Component Autocomplete
  clientItems(value) {
    if (!this.getValues.componentFormGroup.get('packageId').value) {
      this.checkCopy = false;
    }
    if (!value) {
      this.assignResourceCopy();
      this.getValues.componentFormGroup.get('noOfComponent').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').enable();
      this.getValues.componentFormGroup.get('subCompId').setValue('');
      this.getValues.componentFormGroup.get('currencyId').setValue('');
    }
    if (value) {
      if (!this.checkCopy) {
        this.componentfilterList = Object.assign([], this.getValues.componentList).filter(
          item => ((item.compName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
      } else {
        if (this.checkCopy) {
          this.componentfilterList = Object.assign([], this.checkCompList).filter(
            item => ((item.compName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
        }
      }
    }
  }
  checkNoofComp(count) {
    const compCountList = this.componentfilterList.filter(x => x.componentId === this.getValues.componentFormGroup.get('compId').value);
    if (compCountList.length > 0) {
      if (compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_CHECK_PCC1.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_CHECK_PCC2.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_CHECK_PCC3.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_CHECK_PCC3E.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_COURT_RECORD.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.CRIMINAL_DATABASE.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.OFAC_SDN.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.ONLINE_CRC.toLowerCase() ||
        compCountList[0].compName.toLowerCase() === this.common.ONLINE_CRC_INTERNAL.toLowerCase()) {
        if (Number(count.value) > 5) {
          this.countFlag = true;
          this.maxnoofcomp = 5;
          this.getValues.componentFormGroup.get('noOfComponent').setErrors({ incorrect: true });
        } else {
          this.countFlag = false;
          this.getValues.componentFormGroup.get('noOfComponent').setErrors(null);
        }
      } else if (compCountList[0].compName.toLowerCase() === this.common.REFERENCE_CHECK.toLowerCase()) {
        if (Number(count.value) > 4) {
          this.countFlag = true;
          this.maxnoofcomp = 4;
          this.getValues.componentFormGroup.get('noOfComponent').setErrors({ incorrect: true });
        } else {
          this.countFlag = false;
          this.getValues.componentFormGroup.get('noOfComponent').setErrors(null);
        }
      }
    }
    if (Number(count.value) < 1) {
      if (this.getValues.componentFormGroup.get('noOfComponent').value === '0') {
        this.getValues.componentFormGroup.get('noOfComponent').setErrors({ incorrect: true });
      } else {
        this.getValues.componentFormGroup.get('noOfComponent').setErrors(null);
      }
    }
  }
  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.componentfilterList.filter(e =>
          e.compName.toLowerCase() === value.toLowerCase());
      }
    }
  }
  get displayclientFn() {
    const clientNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.getValues.componentList && this.getValues.componentList.length > 0) {
          comp = this.getValues.componentList.find(x => x.componentId === comp);
          return comp.compName;
        } else {
          return null;
        }
      }
    };
    return clientNew;
  }
  validateinvitationCompList() {
    const dupList = [];
    const packmaxvalueList = JSON.parse(JSON.stringify(Object.assign([], this.getValues.componentList.filter(f => {
      if (f.subCompFlag || f.packageSubComponent > 0) {
        return f.packageSubComponent.some(s => s.maxNoOfComp === 1);
      } else {
        return f.maxNoOfComp === 1 ? true : false;
      }
    }))));
    packmaxvalueList.map(m => {
      if (m.subCompFlag || m.packageSubComponent > 0) {
        m.packageSubComponent = m.packageSubComponent.filter(f => f.maxNoOfComp === 1 ? true : false);
      }
    });

    this.getValues.scopeList.caseComponent.forEach(el => {
      const indcompValue = packmaxvalueList.find(f => el.compId === f.compId);
      if (indcompValue) {
        if (!dupList.some(s => s.componentId === indcompValue.compId)) {
          const actuallist = this.getValues.componentList.find(f1 => f1.componentId === indcompValue.compId);
          if (actuallist.packageSubComponent) {
            actuallist.packageSubComponent.map(m => {
              if (el.caseSubComponent.some(s => s.subCompId === m.subCompId && m.maxNoOfComp === 1)) {
                m.disable = true;
                m.ischecked = false;
                m.noOfComponent = 0;
              }
            });
          }
          actuallist.disable = true;
          actuallist.ischecked = false;
          actuallist.noOfComponent = 0;
          dupList.push(indcompValue);
        }
      }
    });
  }
  // Package change
  packageName(e) {
    if (e) {
      const pricepack = this.getValues.packList.find(x => x.packageId === e);
      if (pricepack && this.getValues.type === 'invitation') {
        this.packPrice = pricepack.price;
      }
      this.getValues.compCommonLists.packageId = e;
      if (this.editFlag === true && this.getValues.scopeList) {
        const pac = this.getValues.packList.filter(x => x.packageId === this.getValues.scopeList.packageId);
        if (((this.getValues.scopeList.action === 'Edit' && this.getValues.type === 'scope') ||
          (this.getValues.type === 'invitation')) && pac.length > 0) {
          this.getValues.componentFormGroup.get('packageId').setValue(pac[0].packageId);
          this.getValues.componentFormGroup.get('packageId').disable();
        }
      }
      // get package list
      this.screeningService.getComponentByPackageId(e).subscribe(res => {
        if (res) {
          this.componentListpackid = res;
          this.getValues.packComponent = res;
          this.emitComponent();
          this.compflag = true;
          const dupList = [];
          // const packmaxvalueList = [];
          // this.getValues.packComponent.forEach(element => {
          //   if (element.subCompFlag || element.caseSubComponent > 0) {
          //     if (element.compId)
          //   }

          // });
          const packmaxvalueList = JSON.parse(JSON.stringify(Object.assign([], this.getValues.componentList.filter(f => {
            if (f.subCompFlag || f.packageSubComponent > 0) {
              return f.packageSubComponent.some(s => s.maxNoOfComp === 1);
            } else {
              return f.maxNoOfComp === 1 ? true : false;
            }
          }))));
          packmaxvalueList.map(m => {
            if (m.subCompFlag || m.packageSubComponent > 0) {
              m.packageSubComponent = m.packageSubComponent.filter(f => f.maxNoOfComp === 1 ? true : false);
            }
          });
          // if (this.editFlag && this.getValues.scopeList && this.getValues.scopeList.packageId === 0) {
          //   const duplicatList = this.getValues.scopeList.caseComponent.filter(f => {
          //     if (f.subCompFlag) {
          //       return f.caseSubComponent.some(s => s.maxNoOfComp === 1);
          //     } else {
          //       return f.maxNoOfComp === 1 ? true : false;
          //     }
          //   });
          //   if (duplicatList && duplicatList.length > 0) {
          //     return false;
          //   }
          // }

          this.getValues.packComponent.forEach(el => {
            const indcompValue = packmaxvalueList.find(f => el.componentId === f.componentId);
            if (indcompValue) {
              if (!dupList.some(s => s.componentId === indcompValue.componentId)) {
                const actuallist = this.getValues.componentList.find(f1 => f1.componentId === indcompValue.componentId);
                if (actuallist.packageSubComponent) {
                  actuallist.packageSubComponent.map(m => {
                    if (el.packageSubComponent.some(s => s.subCompId === m.subCompId && m.maxNoOfComp === 1)) {
                      m.disable = true;
                      m.ischecked = false;
                      m.noOfComponent = 0;
                    }
                  });
                }
                actuallist.disable = true;
                actuallist.ischecked = false;
                actuallist.noOfComponent = 0;
                dupList.push(indcompValue);
              }
            }
          });

          // const dupList



          // const dupList = packmaxvalueList.filter((o1) => {
          //   // filter out (!) items in result2
          //   return this.getValues.packComponent.some((o2) => {
          //     if (o1.componentId === o2.componentId) {
          //       if (o1.subCompFlag || o1.caseSubComponent) {
          //         o1.caseSubComponent = o1.packageSubComponent.filter(o3 => {
          //           o2.caseSubComponent.some(o4 => {
          //             return o3.subCompId === o4.subCompId;
          //           });
          //         });
          //       }
          //     }
          //     return o1.componentId === o2.componentId;          // assumes unique id
          //   });
          // });
          // this.getValues.componentList.findIndex()
          const packIndex = this.getValues.componentList.findIndex(f => f.packComplist === true);
          if (packIndex > -1) {
            this.getValues.componentList.splice(packIndex, 1);
          }
          const packcompid = 9999999;
          this.getValues.componentList.push({
            compList: res, packComplist: true, packageName: pricepack.packageName,
            componentId: packcompid
          });
          this.expandrows[packcompid] = true;
          this.checkCompList = this.common.CloneObject(this.getValues.componentList);
          // PACKAGE FILTER
          if (this.componentListpackid.length > 0) {
            // package select single component removal
            // this.componentListpackid.forEach((loop) => {
            //   const maxIndex = this.checkCompList.findIndex(el => el.maxNoOfComp === 1 && el.componentId === loop.componentId);
            //   if (maxIndex >= 0) {
            //     this.checkCompList.splice(maxIndex, 1);
            //   }
            //   this.componentfilterList = this.checkCompList;
            // });
            // if (this.getValues.scopeList && ((this.getValues.scopeList.action === 'Edit' && this.getValues.type === 'scope') ||
            //   this.getValues.type === 'invitation')) {
            //   this.GetComponetDetails();
            // }
          }
        }
        this.getValues.componentFormGroup.get('compId').setValue('');
        this.checkCopy = true;
        // if ((!this.editFlag) || (this.editFlag === true && this.getValues.scopeList.packageId === 0)) {
        //   this.createControls('Package');
        // }
      });
      this.getValues.compCommonLists.packageId = e;
    } else {
      // this.packPrice = 0;
      // thi s.getValues.compCommonLists.caseComponent.forEach((ele1, index) => {
      //   const ind = this.getValues.compCommonLists.caseComponent.filter(x => x.type !== 'Package');
      //   this.getValues.compCommonLists.caseComponent = ind;
      //   // this.savecrtCase.caseComponent.splice(index, ind.length);
      // });
      this.getValues.componentList.forEach(el => {
        if (el.subCompFlag && el.packageSubComponent) {
          el.packageSubComponent.map(m => {
            if (m.disable) {
              m.disable = false;
            }
          });
        } else {
          if (el.disable) {
            el.disable = false;
          }
        }
      });
      const packIndex = this.getValues.componentList.findIndex(f => f.packComplist === true);
      if (packIndex > -1) {
        this.getValues.componentList.splice(packIndex, 1);
      }
      this.checkCopy = false;
      this.componentListpackid = [];
      this.getValues.componentFormGroup.get('compId').setValue('');
      this.compflag = false;
      this.getValues.compCommonLists.packageId = 0;
      this.getValues.componentFormGroup.get('packageId').setValue('');
    }
    this.clientItems('');
    this.emitComponent();
  }
  GetComponetDetails() {
    if (this.getValues.scopeList && (this.getValues.scopeList.action === 'Edit' && this.getValues.type === 'scope') ||
      this.getValues.type === 'invitation') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.getValues.scopeList.caseComponent.length; i++) {
        const obj = this.checkCompList.findIndex(x => x.maxNoOfComp === 1 && x.componentId === this.scopelist[i].compId);
        if (obj >= 0) {
          this.checkCompList.splice(obj, 1);
        }
        this.componentfilterList = this.common.CloneObject(this.checkCompList);
      }
    }
  }
  componentChange(e) {
    let ressublist = [];
    let maxsublist = [];
    let scopeEditList = [];
    const subDuplist = [];
    if (e > 0 && this.editindex === -1) {
      this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
        '', this.getValues.componentFormGroup, false, false, false);
      const currency = this.componentfilterList.filter(x => x.componentId === e);
      this.getValues.componentFormGroup.get('currencyId').setValue(currency[0].currencyId);
    }
    this.screeningService.getClientSubComponent(this.getValues.clientId, e).subscribe(res => {
      if (res.length > 0) {
        this.filtersubcomplist = res;
        ressublist = this.common.CloneObject(res);
        this.subflag = true;
        if (this.getValues.packComponent && this.getValues.packComponent.length > 0) {
          this.componentListpackid.forEach((ele) => {
            if (ele.packageSubComponent) {
              ele.packageSubComponent.forEach((el) => {
                maxsublist = ressublist.filter(x => x.maxNoOfComp === 1);
                const checkpacklist = maxsublist.filter(x => x.subCompId === el.subCompId);
                if (checkpacklist.length > 0) {
                  subDuplist.push(checkpacklist[0]);
                }
              });
            }
          });
          subDuplist.forEach((ele) => {
            const ind = ressublist.findIndex(x => x.subCompName === ele.subCompName);
            ressublist.splice(ind, 1);
            this.filtersubcomplist = ressublist;
          });
        } else {
          this.filtersubcomplist = res;
        }
        if (this.getValues.scopeList && this.editFlag === true) {
          if (this.getValues.scopeList.caseComponent.length > 0) {
            this.getValues.scopeList.caseComponent.forEach((ele) => {
              if (ele.caseSubComponent) {
                if (ressublist.length > 0) {
                  ele.caseSubComponent.forEach(element => {
                    const fillIndex = ressublist.findIndex(x => x.maxNoOfComp === 1 && x.subCompId === element.subCompId);
                    if (fillIndex >= 0) {
                      ressublist.splice(fillIndex, 1);
                    }
                    this.filtersubcomplist = this.common.CloneObject(ressublist);
                  });
                }
              }
            });
          } else {
            this.filtersubcomplist = res;
          }
        }
      } else {
        this.subflag = false;
      }
    });
    if (this.componentfilterList && this.componentfilterList.length >= 1) {
      this.componentfilterList.forEach(ele => {
        if (ele.maxNoOfComp === 1) {
          this.getValues.componentFormGroup.get('noOfComponent').setValue(1);
          this.getValues.componentFormGroup.get('noOfComponent').disable();
        } else {
          this.getValues.componentFormGroup.get('noOfComponent').enable();
        }
      });
    }
    const dupsubcomponent = this.getValues.compCommonLists.caseComponent.filter(x => x.subCompFlag !== true && x.type !== 'Package');
    this.existItem = dupsubcomponent.filter(x => x.compId === e);
    if (this.existItem.length > 0) {
      this.showTopCenter('warn', 'Failure Message', 'Component List has been already exist');
      this.getValues.componentFormGroup.get('compId').setValue('');
      this.getValues.componentFormGroup.get('currencyId').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').enable();
    }

    // if (this.getValues.type === 'scope' && this.editFlag === true) {
    if (this.getValues.scopeList && this.getValues.scopeList.caseComponent.length > 0) {
      this.getValues.scopeList.caseComponent.forEach(ele => {
        if (ele.subCompFlag !== true) {
          const checkScopeList = this.getValues.scopeList.caseComponent.filter(x => x.compId ===
            this.getValues.componentFormGroup.get('compId').value);
          if (checkScopeList.length > 0) {
            scopeEditList = checkScopeList.filter(x => x.maxNoOfComp === 1);
          }
        }
      });
      if (scopeEditList.length > 0) {
        this.showTopCenter('warn', 'Failure Message', 'Component List has been already exist, Select another One');
        this.getValues.componentFormGroup.get('compId').setValue('');
        this.getValues.componentFormGroup.get('noOfComponent').setValue('');
        this.getValues.componentFormGroup.get('noOfComponent').enable();
      }
    }
    // }
  }
  subChange(e) {
    const subCompList = this.filtersubcomplist.filter(m => m.subCompId === e);
    if (e > 0) {
      this.currencyControls = new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencyList,
        '', this.getValues.componentFormGroup, false, false, false);
      const currency = this.filtersubcomplist.filter(x => x.subCompId === e);
      this.getValues.componentFormGroup.get('currencyId').setValue(currency[0].currencyId);
    } else {
      this.getValues.componentFormGroup.get('currencyId').setValue('');
    }
    subCompList.forEach(ele => {
      if (ele.maxNoOfComp === 1) {
        this.getValues.componentFormGroup.get('noOfComponent').disable();
        this.getValues.componentFormGroup.get('noOfComponent').setValue(1);

      } else {
        this.getValues.componentFormGroup.get('noOfComponent').setValue('');
        this.getValues.componentFormGroup.get('noOfComponent').enable();
      }
    });
    if (this.subflag) {
      const dupsubcomponent = this.getValues.compCommonLists.caseComponent.filter(x => x.subCompFlag === true && x.type !== 'Package');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < dupsubcomponent.length; i++) {
        this.existItem = dupsubcomponent[i].caseSubComponent.filter(item => item.subCompId === e);
        if (this.existItem.length > 0) {
          this.showTopCenter('warn', 'Failure Message', 'Sub-Component List has been already exist');
          this.getValues.componentFormGroup.get('subCompId').setValue('');
          this.getValues.componentFormGroup.get('currencyId').setValue('');
          this.getValues.componentFormGroup.get('noOfComponent').setValue('');
          this.getValues.componentFormGroup.get('noOfComponent').enable();
          return;
        }
      }
    }
    this.emitComponent();
  }
  createControls(type) {
    if (type === 'Individual') {
      if ((this.getValues.componentFormGroup.get('noOfComponent').value && this.getValues.componentFormGroup.get('noOfComponent').valid)
        || (this.getValues.componentFormGroup.get('noOfComponent').disabled)) {
        if (!this.subflag) {
          if (this.getValues.componentFormGroup.get('compId').value && this.getValues.componentFormGroup.get('noOfComponent').value) {
            this.casecomponentlist = new CaseComponentVm();
            this.casecomponentlist.compId = this.getValues.componentFormGroup.get('compId').value;
            const value = this.getValues.componentList.filter(x => x.componentId === this.getValues.componentFormGroup.get('compId').value);
            const comp = value[0].compName;
            if (this.getValues.type === 'invitation') {
              this.casecomponentlist.price = value[0].price;
            }
            this.casecomponentlist.componentType = comp;
            this.casecomponentlist.abroadCompFlag = value[0].abroadCompFlag;
            this.casecomponentlist.noOfComponent = this.getValues.componentFormGroup.get('noOfComponent').value;
            const maxcount = value[0].maxNoOfComp;
            this.casecomponentlist.maxNoOfComp = maxcount;
            this.casecomponentlist.subCompFlag = false;
            this.casecomponentlist.caseSubComponent = [];
            this.casecomponentlist.type = type;
            this.casecomponentlist.currencyId = this.getValues.componentFormGroup.get('currencyId').value;
            const currType = this.currencyList.filter(m => m.currencyId === this.getValues.componentFormGroup.get('currencyId').value);
            this.casecomponentlist.currencyType = currType[0].currencyShortName;
            if (this.editindex > -1) {
              this.getValues.compCommonLists.caseComponent[this.editindex] = this.common.CloneObject(this.casecomponentlist);
              this.showTopCenter('success', 'Success Message', 'Individual Component Updated Successfully');
              this.getValues.componentFormGroup.get('noOfComponent').clearValidators();
              this.getValues.componentFormGroup.get('noOfComponent').updateValueAndValidity();
              this.getValues.componentFormGroup.get('currencyId').clearValidators();
              this.getValues.componentFormGroup.get('currencyId').updateValueAndValidity();
              this.getValues.componentFormGroup.get('compId').setValue('');
              this.getValues.componentFormGroup.get('noOfComponent').setValue('');
              this.getValues.componentFormGroup.get('noOfComponent').enable();
              this.getValues.componentFormGroup.get('currencyId').setValue('');
              this.editindex = -1;
              this.tooltip = false;
            } else {
              this.getValues.compCommonLists.caseComponent.push(this.common.CloneObject(this.casecomponentlist));
              this.showTopCenter('success', 'Success Message', 'Individual Component Saved Successfully');
              this.getValues.componentFormGroup.get('noOfComponent').clearValidators();
              this.getValues.componentFormGroup.get('noOfComponent').updateValueAndValidity();
              this.getValues.componentFormGroup.get('compId').setValue('');
              this.getValues.componentFormGroup.get('noOfComponent').setValue('');
              this.getValues.componentFormGroup.get('noOfComponent').enable();
              this.getValues.componentFormGroup.get('currencyId').setValue('');
            }
            this.casecomponentlist.currencyType = '';
          }
        } else {
          this.casecomponentlist.compId = this.getValues.componentFormGroup.get('compId').value;
          const value = this.getValues.componentList.filter(x => x.componentId === this.casecomponentlist.compId);
          const comp = value[0].compName;
          this.casecomponentlist.componentType = comp;
          this.caseSubComponentlist.subCompId = this.getValues.componentFormGroup.get('subCompId').value;
          const valuesub = this.filtersubcomplist.filter(x => x.subCompId === this.getValues.componentFormGroup.get('subCompId').value);
          const subcomp = valuesub[0].subCompName;
          if (this.getValues.type === 'invitation') {
            this.casecomponentlist.price = valuesub[0].price;
          }
          const maxcount = valuesub[0].maxNoOfComp;
          this.casecomponentlist.subCompName = subcomp;
          this.casecomponentlist.subCompFlag = true;
          this.caseSubComponentlist.maxNoOfComp = maxcount;
          this.casecomponentlist.type = type;
          this.caseSubComponentlist.type = type;
          this.casecomponentlist.currencyId = null;
          this.casecomponentlist.abroadCompFlag = value[0].abroadCompFlag;
          this.casecomponentlist.noOfComponent = this.caseSubComponentlist.noOfComponent;
          this.caseSubComponentlist.noOfComponent = this.getValues.componentFormGroup.get('noOfComponent').value;
          this.casecomponentlist.noOfComponent = this.caseSubComponentlist.noOfComponent;

          this.caseSubComponentlist.currencyId = this.getValues.componentFormGroup.get('currencyId').value;
          const currType = this.currencyList.filter(m => m.currencyId === this.getValues.componentFormGroup.get('currencyId').value);
          this.casecomponentlist.currencyType = currType[0].currencyShortName;
          this.casecomponentlist.caseSubComponent.push(this.common.CloneObject(this.caseSubComponentlist));
          if (this.editindex > -1) {
            this.getValues.compCommonLists.caseComponent[this.editindex] = this.common.CloneObject(this.casecomponentlist);
            this.showTopCenter('success', 'Success Message', 'Individual Component Updated Successfully');
            this.getValues.componentFormGroup.get('noOfComponent').clearValidators();
            this.getValues.componentFormGroup.get('noOfComponent').updateValueAndValidity();
            this.getValues.componentFormGroup.get('currencyId').clearValidators();
            this.getValues.componentFormGroup.get('currencyId').updateValueAndValidity();
            this.getValues.componentFormGroup.get('compId').setValue('');
            this.getValues.componentFormGroup.get('subCompId').setValue('');
            this.getValues.componentFormGroup.get('noOfComponent').setValue('');
            this.getValues.componentFormGroup.get('currencyId').setValue('');
            this.casecomponentlist.caseSubComponent = [];
            this.editindex = -1;
            this.tooltip = false;
            this.caseSubComponentlist = new CaseSubComponentVm();
            this.getValues.componentFormGroup.get('compId').setValue('');
            this.getValues.componentFormGroup.get('subCompId').setValue('');
            this.getValues.componentFormGroup.get('noOfComponent').setValue('');
            this.getValues.componentFormGroup.get('currencyId').setValue('');
            this.subflag = false;
          } else {
            this.getValues.compCommonLists.caseComponent.push(this.common.CloneObject(this.casecomponentlist));
            this.showTopCenter('success', 'Success Message', 'Individual Component Saved Successfully');
            this.caseSubComponentlist = new CaseSubComponentVm();
            this.getValues.componentFormGroup.get('noOfComponent').clearValidators();
            this.getValues.componentFormGroup.get('noOfComponent').updateValueAndValidity();
            this.getValues.componentFormGroup.get('compId').setValue('');
            this.getValues.componentFormGroup.get('currencyId').setValue('');
            this.getValues.componentFormGroup.get('subCompId').setValue('');
            this.getValues.componentFormGroup.get('noOfComponent').setValue('');
            this.casecomponentlist.subCompName = '';
            this.casecomponentlist.caseSubComponent = [];
            this.subflag = false;
          }
          this.casecomponentlist.currencyType = '';
        }
        if (this.dt) {
          this.dt.reset();
        }
      } else {
        this.getValues.componentFormGroup.get('noOfComponent').setValidators(Validators.required);
        this.getValues.componentFormGroup.get('noOfComponent').updateValueAndValidity();
        this.getValues.componentFormGroup.get('noOfComponent').setErrors({ incorrect: true });
        this.getValues.componentFormGroup.get('noOfComponent').markAsTouched();
      }
      if (this.getValues.type === 'scope') {
        this.getValues.componentFormGroup.get('remarks').clearValidators();
        this.getValues.componentFormGroup.get('remarks').updateValueAndValidity();
      }
    } else if (type === 'Package') {
      if (this.componentListpackid.length > 0) {
        if (this.getValues.compCommonLists.caseComponent.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          const compList = this.getValues.compCommonLists.caseComponent.filter(x => x.type === 'Package');
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < compList.length; i++) {
            const ind = this.getValues.compCommonLists.caseComponent.findIndex(x => x.type === compList[i].type);
            if (ind > -1) {
              this.getValues.compCommonLists.caseComponent.splice(ind, 1);
            }
          }
        }
        this.componentListpackid.forEach((ele) => {
          if (!ele.packageSubComponent) {
            this.casecomponentlist = new CaseComponentVm();
            this.casecomponentlist.compId = ele.componentId;
            this.casecomponentlist.componentType = ele.compName;
            this.casecomponentlist.noOfComponent = ele.noOfComponent;
            this.casecomponentlist.type = type;
            this.casecomponentlist.subCompFlag = false;
            if (this.getValues.type === 'invitation' && this.packPrice > 0) {
              this.casecomponentlist.price = this.packPrice;
            }
            this.getValues.compCommonLists.caseComponent.push(this.common.CloneObject(this.casecomponentlist));
            this.casecomponentlist = new CaseComponentVm();
          } else {
            ele.packageSubComponent.forEach(subele => {
              this.casecomponentlist.compId = ele.componentId;
              this.casecomponentlist.componentType = ele.compName;
              this.caseSubComponentlist.subCompId = subele.subCompId;
              this.casecomponentlist.subCompName = subele.subComName;
              this.casecomponentlist.noOfComponent = subele.noOfComponent;
              this.casecomponentlist.type = type;
              this.caseSubComponentlist.type = type;
              this.casecomponentlist.subCompFlag = true;
              if (this.getValues.type === 'invitation' && this.packPrice > 0) {
                this.casecomponentlist.price = this.packPrice;
              }
              this.casecomponentlist.caseSubComponent = [];
              this.casecomponentlist.caseSubComponent.push(this.common.CloneObject(this.caseSubComponentlist));
              this.getValues.compCommonLists.caseComponent.push(this.common.CloneObject(this.casecomponentlist));
            });
            this.casecomponentlist = new CaseComponentVm();
            this.caseSubComponentlist = new CaseSubComponentVm();
          }
        });
        this.showTopCenter('success', 'Success Message', 'Package Components Added Successfully');
        this.getValues.componentFormGroup.get('packageId').setValue('');
      }
    }
    this.emitComponent();
  }
  removeControl() {
    if (!this.subflag) {
      this.getValues.componentFormGroup.get('compId').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').enable();
      this.getValues.componentFormGroup.get('currencyId').setValue('');
    } else {
      this.getValues.componentFormGroup.get('compId').setValue('');
      this.casecomponentlist.subCompName = '';
      this.getValues.componentFormGroup.get('subCompId').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').setValue('');
      this.getValues.componentFormGroup.get('noOfComponent').enable();
      this.getValues.componentFormGroup.get('currencyId').setValue('');
    }
    this.editindex = -1;
  }
  editDelete(data, mode: string) {
    this.editindex = -1;
    this.editindex = this.getValues.compCommonLists.caseComponent.indexOf(data);
    if (mode === 'Delete') {
      if (this.editindex > -1) {
        this.getValues.compCommonLists.caseComponent.splice(this.editindex, 1);
      }
      this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      this.editindex = -1;
      this.emitComponent();
    } else if (mode === 'Edit') {
      this.tooltip = true;
      if (!data.subCompFlag === true) {
        this.subflag = false;
        this.getValues.componentFormGroup.patchValue({
          compId: data.compId,
          noOfComponent: data.noOfComponent,
          currencyId: data.currencyId
        });
        if (data.maxNoOfComp === 1) {
          this.getValues.componentFormGroup.get('noOfComponent').disable();
          this.getValues.componentFormGroup.value.noOfComponent = this.getValues.componentFormGroup.get('noOfComponent').value;
        } else {
          this.getValues.componentFormGroup.get('noOfComponent').setValue(this.getValues.componentFormGroup.get('noOfComponent').value);
          this.getValues.componentFormGroup.get('noOfComponent').enable();
        }
      } else {
        this.subflag = true;
        data.caseSubComponent.forEach((ele, i) => {
          this.getValues.componentFormGroup.patchValue({
            compId: data.compId,
            subCompId: ele.subCompId,
            noOfComponent: ele.noOfComponent,
            currencyId: ele.currencyId
          });
        });
        this.componentChange(this.getValues.componentFormGroup.get('compId').value);
        const singleList = data.caseSubComponent.filter(m => m.maxNoOfComp === 1);
        if (singleList && singleList.length > 0) {
          this.getValues.componentFormGroup.get('noOfComponent').setValue(1);
          this.getValues.componentFormGroup.get('noOfComponent').disable();
        } else {
          this.getValues.componentFormGroup.get('noOfComponent').setValue(this.getValues.componentFormGroup.get('noOfComponent').value);
          this.getValues.componentFormGroup.get('noOfComponent').enable();
        }
      }
    }
  }
  emitComponent() {
    this.compToEmit.emit(this.getValues);
  }
  ngOnDestroy() {
    this.getValues.scopeList = '';
    this.getValues.compCommonLists = '';
    this.getValues.packComponent = '';
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
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  testfun() {
    if (this.compfrm.valid) {

    } else {

    }
  }
}
