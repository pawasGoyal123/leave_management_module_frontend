import { StatusType } from "./teamLeaveRequest";

export type MyLeaveRequest={
    id:number;
    fromDate:Date;
    toDate: Date;
    firstHalf: boolean;
    secondHalf: boolean;
    status: StatusType;
    managerComment: string | null
}