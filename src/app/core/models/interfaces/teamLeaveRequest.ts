export interface TeamLeaveRequest {
  id: number;
  employeeName: string;
  fromDate: Date;
  toDate: Date;
  firstHalf: boolean;
  secondHalf: boolean;
  reason: string;
  statusChangeDate: Date;
  status: StatusType;
}

export type StatusType='Pending' | 'Approved' | 'Rejected';