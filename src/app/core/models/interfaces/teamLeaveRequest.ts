export interface TeamLeaveRequest {
  id: number;
  employeeName: string;
  fromDate: string;
  toDate: string;
  firstHalf: boolean;
  secondHalf: boolean;
  reason: string;
  statusChangeDate: string;
  status: StatusType;
}

export type StatusType = 'Pending' | 'Approved' | 'Rejected';

