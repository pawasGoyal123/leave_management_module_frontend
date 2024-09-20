import { StatusType } from './teamLeaveRequest';

export type MyLeaveRequest = {
  id: number;
  fromDate: string;
  toDate: string;
  firstHalf: boolean;
  secondHalf: boolean;
  status: StatusType;
  managerComment: string | null;
};
