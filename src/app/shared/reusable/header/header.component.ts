import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from "@angular/material/icon"
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { User } from '../../../core/models/interfaces/User';
import { FormsModule } from '@angular/forms';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service'; 
import { Subscription } from 'rxjs';
import { getUserProfileName } from '../../utils/getUserProfileName';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatFormFieldModule, MatSelectModule, CommonModule, DropdownModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit,OnDestroy {
  currentUser:(User| null)=null;
  private userSubscription!:Subscription;
  allUsers:(User[])=[];

  constructor(private userService:CurrentUserService){};

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data:User[])=>{
        this.allUsers=data;
    })
    this.userSubscription=this.userService.currentUser$.subscribe((data:(User| null))=>{
        this.currentUser=data;
    })
    
  }


changeActiveUser(){
  if(this.currentUser){
    this.userService.changeCurrentUser(this.currentUser);
  }
}


ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
}

get ProfileName():string{
    return getUserProfileName(this.currentUser!.name);
}

}
