import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeaveBalance } from '../../models/interfaces/leaveBalance';
import {
  GET_LEAVE_REGISTER_BALANCE,
  GET_LEAVE_TYPES,
  GET_TEAM_LEAVE_REGISTER,
  GET_TEAM_LEAVE_REQUEST,
} from '../../constants/api.constants';
import {
  statusType,
  TeamLeaveRequest,
} from '../../models/interfaces/teamLeaveRequest';
import { myLeaveRequest } from '../../models/interfaces/myLeaveRequest';
import { TeamLeaveRegister } from '../../models/interfaces/TeamLeaveRegister';
import { leaveRequestCreationData } from '../../models/interfaces/leaveRequestCreationData';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(private http: HttpClient) {}
  private leaveReqeustCreated=new BehaviorSubject<boolean>(false);
  leaveRequestCreated$=this.leaveReqeustCreated.asObservable();
  getLeaveBalance(userId: number) {
    return this.http.get<LeaveBalance[]>(`${GET_LEAVE_REGISTER_BALANCE}${userId}`);
  }

  getTeamLeaveRequest(userId: number, status: statusType) {
    return this.http.get<TeamLeaveRequest[]>(`${GET_TEAM_LEAVE_REQUEST}${userId}/${status}`);
  }

  updateLeaveRequest(
    leaveRequestId: number,
    leaveStatus: statusType,
    managerComment: string
  ) {
    const data = {
      leaveRequestId,
      leaveStatus,
      managerComment,
    };
    return this.http.put(GET_TEAM_LEAVE_REQUEST, data);
  }

  getLeaveRequestsByEmployeeId(employeeId: number) {
    return this.http.get<myLeaveRequest[]>(`${GET_TEAM_LEAVE_REQUEST}${employeeId}`);
  }

  getTeamLeaveRegister(managerId: number) {
    return this.http.get<TeamLeaveRegister[]>(`${GET_TEAM_LEAVE_REGISTER}${managerId}`);
  }

  getLeaveTypes() {
    return this.http.get(GET_LEAVE_TYPES);
  }

  createLeaveRequest(data: leaveRequestCreationData, employeeId: number) {
    console.log(data);
    return this.http.post(GET_TEAM_LEAVE_REQUEST, {
      ...data,
      employeeId,
    });
  }

  emitLeaveRequestCreated(){
    this.leaveReqeustCreated.next(true);
  }
}