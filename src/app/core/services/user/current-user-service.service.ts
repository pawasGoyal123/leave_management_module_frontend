import { afterNextRender, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GET_EMPLOYEE_URL } from '../../constants/api.constants';
import { User } from '../../models/interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const user = this.getUserFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  getAllUsers() {
    return this.http.get<User[]>(GET_EMPLOYEE_URL);
  }

  changeCurrentUser(user: User) {
   
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);

  
  }

  private getUserFromLocalStorage(): User | null {

      const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
   
  }
}
