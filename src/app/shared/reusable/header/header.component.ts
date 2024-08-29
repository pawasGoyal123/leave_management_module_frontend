import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from "@angular/material/icon"
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,MatFormFieldModule,MatSelectModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  users = [
    {
      username: 'john_doe',
      
    },
    {
      username: 'jane_smith',
      
    },
    {
      username: 'alice_jones',
      
    }
  ];

}
