import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { HeaderComponent } from '../../../shared/reusable/header/header.component';
import { SidebarComponent } from '../../../shared/reusable/sidebar/sidebar.component';

@Component({
  selector: 'app-commonlayout',
  standalone: true,
  imports: [SidebarComponent, AppComponent, HeaderComponent, RouterOutlet],
  templateUrl: './commonlayout.component.html',
  styleUrl: './commonlayout.component.scss',
})
export class CommonlayoutComponent {}
