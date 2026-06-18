export class DeptComponent {
    departCompId: number;
    departId: number;
    component: ComponentType[] = [];
    createdUserId: number;
    departmentName: string;
}
export class ComponentType {
    compName: string;
    componentId: number;
    departCompId: number;
    compShotName: string;
    // archiveFlag: boolean;
    active: boolean;
}
export class ComponentTypeVm {
    //departCompId: number;
    compId: number;
    lookupValue: VerificationModelVm[] = [];
    createdUserId: number;
    compName: string;
}
export class VerificationModelVm {
    lookupName: string;
    lookupId: number;
    compId: number;
    active: boolean;
}
