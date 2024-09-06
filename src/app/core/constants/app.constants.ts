export const BASE_PATH_ATTENDANCE_MANAGEMENT = 'attendancemanagement';
export const TEAM_ATTENDANCE = `${BASE_PATH_ATTENDANCE_MANAGEMENT}/teamattendance`;
export const MY_ATTENDANCE = `${BASE_PATH_ATTENDANCE_MANAGEMENT}/attendance/myattendance`;

// Team Attendance
export const TEAM_LEAVE_REQUEST = 'teamleaverequest';
export const TEAM_LEAVE_REGISTER = 'teamleaveregister';
export const STATUS_PARAM = ':status';
export const PENDING='pending';
export const REJECTED='rejected';
export const ACCEPTED='approved';

// My Attendance
export const LEAVE_REGISTER = 'leaveRegister';
export const LEAVE_REQUESTS = 'leaveRequests';

// Full Paths
export const TEAM_LEAVE_REQUEST_URL = `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/${STATUS_PARAM}`;
export const TEAM_LEAVE_REGISTER_URL = `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REGISTER}`;
export const MY_ATTENDANCE_LEAVE_REGISTER_URL = `${MY_ATTENDANCE}/${LEAVE_REGISTER}`;
export const MY_ATTENDANCE_LEAVE_REQUESTS_URL = `${MY_ATTENDANCE}/${LEAVE_REQUESTS}`;

export const TEAM_LEAVE_REQUEST_ROUTE=[
    {
      path:`${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/${PENDING}`,
      label:'Pending'
    },
    {
      path:`${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/${ACCEPTED}`,
      label:'Approved'
    },
    {
      path:`${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/${REJECTED}`,
      label:'Rejected'
    }
]

export const MY_ATTENDANCE_NAVIGATION= [
    {
      path: LEAVE_REGISTER,
      label: 'Leave Register',
    },
    {
      path: LEAVE_REQUESTS,
      label: 'Leave Request',
    }
  ];


