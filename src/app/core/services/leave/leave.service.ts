import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GET_EMPLOYEES_BY_MANAGER_ID,
  GET_LEAVE_REGISTER_BALANCE,
  GET_LEAVE_TYPES,
  GET_TEAM_LEAVE_REGISTER,
  GET_TEAM_LEAVE_REQUEST,
} from '../../constants/api.constants';
import { LeaveBalance } from '../../models/interfaces/leaveBalance';
import { BehaviorSubject } from 'rxjs';
import { ANOMALY_DETECTION, FORECAST } from '../../constants/ai.constants';
import { Employee } from '../../models/interfaces/Employee';
import { LeaveRequestCreationData } from '../../models/interfaces/leaveRequestCreationData';
import { LeaveType } from '../../models/interfaces/leaveType';
import { MyLeaveRequest } from '../../models/interfaces/myLeaveRequest';
import { TeamLeaveRegister } from '../../models/interfaces/TeamLeaveRegister';
import {
  StatusType,
  TeamLeaveRequest,
} from '../../models/interfaces/teamLeaveRequest';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  constructor(private http: HttpClient) {}

  private leaveReqeustCreated = new BehaviorSubject<boolean>(false);

  //subject used to emit event after a leave request creation request is sent by the user

  leaveRequestCreated$ = this.leaveReqeustCreated.asObservable();

  //observable used to catch the emission of event and refetch the leave requests once the leave request creation request is succesful

  getLeaveBalance(employeeId: number) {
    return this.http.get<LeaveBalance[]>(
      `${GET_LEAVE_REGISTER_BALANCE}${employeeId}`
    );
  }

  //method to get the leave balance of particular employee

  getTeamLeaveRequest(managerId: number, status: StatusType) {
    return this.http.get<TeamLeaveRequest[]>(
      `${GET_TEAM_LEAVE_REQUEST}${managerId}/${status}`
    );
  }

  //method to get the leave request of all the employees under a manager according to status of the leave request

  updateLeaveRequest(
    leaveRequestId: number,
    leaveStatus: StatusType,
    managerComment: string
  ) {
    const data = {
      leaveRequestId,
      leaveStatus,
      managerComment,
    };
    return this.http.put(GET_TEAM_LEAVE_REQUEST, data);
  }

  //method to update the status of leave request to approved or rejected based on the action

  getLeaveRequestsByEmployeeId(employeeId: number) {
    return this.http.get<MyLeaveRequest[]>(
      `${GET_TEAM_LEAVE_REQUEST}${employeeId}`
    );
  }

  //method to fetch all the leave request for the current employee

  getTeamLeaveRegister(managerId: number) {
    return this.http.get<TeamLeaveRegister[]>(
      `${GET_TEAM_LEAVE_REGISTER}${managerId}`
    );
  }

  //method to fetch the team leave register data for all the employees under the current user

  getLeaveTypes() {
    return this.http.get<LeaveType[]>(GET_LEAVE_TYPES);
  }

  //method to fetch the leave types in the leave request creation form

  createLeaveRequest(data: LeaveRequestCreationData, employeeId: number) {
    return this.http.post(GET_TEAM_LEAVE_REQUEST, {
      ...data,
      employeeId,
    });
  }

  //method to make post request for the creation of leave request for the current user

  emitLeaveRequestCreated() {
    this.leaveReqeustCreated.next(true);
  }

  //method to emit the creation event of leave request so that leave request can be refetched on success

  getForecasting(employeeId: number) {
    return this.http.get(FORECAST + employeeId, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'access-control-allow-origin': '*',
      },
      responseType: 'blob',
    });
  }

  //method to get the forecasting data for chosen employee under particular manager to predict his leave request trends

  getAnomalyDetection(employeeId: number) {
    return this.http.get(ANOMALY_DETECTION + employeeId, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
        'access-control-allow-origin': '*',
      },
      responseType: 'blob',
    });
  }

  //method to get the anomalities in the leave request behaviours of particular employee under manager

  getEmployeesByManagerId(managerId: number) {
    return this.http.get<Employee[]>(GET_EMPLOYEES_BY_MANAGER_ID + managerId);
  }

  //method to get the list of all employees under a manager
}
