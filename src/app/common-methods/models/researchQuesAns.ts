import { UntypedFormGroup } from '@angular/forms';

export class ResearchEmpQues {
    questionId: number;
    questionName: string;
    questionWithUrl: string;
    description: string;
    verifyStep: number;
    displayOrder: number;
    attachmentReqFlag: boolean;
    active: boolean;
    logginId: number;
    options: ResearchOptionVm[] = [];
    typeFlag: boolean;
}
export class ResearchOptionVm {
    answerId: number;
    optionId: number;
    optionName: string;
    progressBarValue: number;
    detAvailable: boolean;
    subDetId: number;
    subDetail: ResearchSubDetTransVm[] = [];
    displayOrder: number;
    active: boolean;
}
export class ResearchSubOptionlistVm
{
    subDetId: number;
    questionId: number;
    answerId: number;
    optionId: number;
    optionList: ResearchSubDetTransVm[] = [];
    active: boolean;
}
export class ResearchSubDetTransVm {
    subDetTransId: number;
    lookUpId: number;
    lookUpName: string;
    displayOrder: number;
    active = true;
}
export class ResearchCommonEmpIns {
    researchFormGroup: UntypedFormGroup;
    stream: string;
    type: string;
    constructor(researchFormGroup: UntypedFormGroup,
        stream: string,
        type: string
    ) {
        this.researchFormGroup = researchFormGroup;
        this.stream = stream;
        this.type = type;
    }
}
