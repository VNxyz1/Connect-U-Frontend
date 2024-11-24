import { Component, Input, OnInit } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { Button } from 'primeng/button';
import { NavigationEnd, Router } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { filter } from 'rxjs/operators';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { NgClass } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TabMenuModule,
    Button,
    AngularRemixIconComponent,
    MenuModule,
    SidebarModule,
    NgClass,
    ImageModule,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @Input() currentUrl: string | undefined;
  items: MenuItem[] = [];
  isMd: boolean = false;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.updateMenuItems();
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url; // Update currentUrl first
        this.updateMenuItems(); // Then update menu items
      });

    this.breakpointObserver
      .observe([
        Breakpoints.Handset, // For mobile devices
        '(max-width: 1085px)', // Custom breakpoint for medium devices
      ])
      .subscribe((result) => {
        const breakpoints = result.breakpoints;
        this.isMobile = breakpoints[Breakpoints.Handset] || false; // Check if it's a handset
        this.isMd = breakpoints['(max-width: 1085px)'] || false; // Check if width is <= 1085px
      });
    this.updateMenuItems(); // Initialize the desktop menu items
  }

  getSeverity(
    path: string
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

  private updateMenuItems() {
    this.items = [
      {
        label: 'Home',
        route: '/',
        icon: this.activeIcon('/'),
        command: () => this.navigateTo('/'),
      },
      {
        label: 'Search',
        route: '/search',
        icon: this.activeIcon('/search'),
        command: () => this.navigateTo('/search'),
      },
      {
        label: 'Create Event',
        route: '/create-event',
        icon: 'add-line',
        command: () => this.navigateTo('/create-event'),
      },
      {
        label: 'My Events',
        route: '/my-events',
        icon: this.activeIcon('/my-events'),
        command: () => this.navigateTo('/my-events'),
      },
      {
        label: 'My Space',
        route: '/my-space',
        icon: this.activeIcon('/my-space'),
        command: () => this.navigateTo('/my-space'),
      },
    ];
  }
}
