import { statusType } from "./teamLeaveRequest";

export type myLeaveRequest={
    id:number;
    fromDate:Date;
    toDate: Date;
    firstHalf: boolean;
    secondHalf: boolean;
    status: statusType;
    managerComment: string | null
}