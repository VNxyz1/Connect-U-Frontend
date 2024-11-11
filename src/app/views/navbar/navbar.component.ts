import {Component, OnInit} from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TabMenuModule,
    Button
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {
  }
  navigateTo(path:string){
    this.router.navigate([path]);
  }
}
