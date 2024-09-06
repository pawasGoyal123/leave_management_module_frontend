export interface LeaveBalance{
    month_year:Date;
    available:number;
    accrued:number;
    consumed:number;
    total_balance:number;
}

export const leaveBalanceLabels={
    'month_year':"Month & Year",
    'available':"Available",
    'accrued':"Accrued",
    'consumed':"Consumed",
    'total_balance':"Balance"
}
