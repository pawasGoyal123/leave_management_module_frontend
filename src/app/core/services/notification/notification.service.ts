import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GET_NOTIFICATION_BY_EMPLOYEE_ID } from '../../constants/api.constants';
import { NotificationType } from '../../models/interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAllNotifications(employeeId: number) {
    return this.http.get<NotificationType[]>(
      GET_NOTIFICATION_BY_EMPLOYEE_ID + employeeId
    );
  }

  //method to get all the notifications for a particular employee 

  updateNotificationStatus(notificationId: number) {
    return this.http.put(GET_NOTIFICATION_BY_EMPLOYEE_ID + notificationId, {});
  }

  //method to set the read status of a notification with notificationId to read
}
