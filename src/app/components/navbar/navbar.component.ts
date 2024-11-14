import { Component, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { Button } from 'primeng/button';
import { NavigationEnd, Router } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TabMenuModule, Button, AngularRemixIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentUrl: string | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        console.log(this.currentUrl); // Ausgabe der neuen Route nach Navigation
      });
  }
  getSeverity(
    path: string,
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined {
    return this.currentUrl === path ? 'secondary' : 'primary';
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
    console.log(this.currentUrl);
  }
  activeIcon(path: string): any {
    const iconBaseMap: { [key: string]: string } = {
      '/': 'home-2',
      '/search': 'search',
      '/create-event': 'add',
      '/my-events': 'function',
      '/my-space': 'user-3',
    };

    const baseIcon = iconBaseMap[path];

    return this.currentUrl === path ? `${baseIcon}-fill` : `${baseIcon}-line`;
  }
}
