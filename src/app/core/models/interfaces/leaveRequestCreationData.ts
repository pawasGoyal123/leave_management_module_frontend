export type leaveRequestCreationData = {
  employeeId: number;
  fromDate: Date;
  toDate: Date;
  duration: string;
  firstHalf: boolean;
  secondHalf: boolean;
  leaveTypeName: string;
  reason: string;
};
