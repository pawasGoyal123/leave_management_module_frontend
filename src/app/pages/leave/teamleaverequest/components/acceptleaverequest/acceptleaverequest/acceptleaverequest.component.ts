import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'

type DialogData={
  message:string;

}

@Component({
  selector: 'app-acceptleaverequest',
  standalone: true,
  imports: [MatDialogModule,MatFormFieldModule,FormsModule,MatButtonModule,MatInputModule,CdkTextareaAutosize],
  templateUrl: './acceptleaverequest.component.html',
  styleUrl: './acceptleaverequest.component.scss'
})
export class AcceptleaverequestComponent {
  name:string=''
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData){};

}
