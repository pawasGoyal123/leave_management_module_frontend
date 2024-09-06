export interface TeamLeaveRequest {
  id: number;
  employeeName: string;
  fromDate: Date;
  toDate: Date;
  firstHalf: boolean;
  secondHalf: boolean;
  reason: string;
  statusChangeDate: Date;
  status: statusType;
}

export type statusType='Pending' | 'Approved' | 'Rejected';