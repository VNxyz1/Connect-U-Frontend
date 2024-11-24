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
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

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
    TranslocoPipe,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @Input() currentUrl: string | null = null;
  items: MenuItem[] = [];
  isMd: boolean = false;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private translocoService: TranslocoService
  ) {
    setTimeout(() => {
      this.updateMenuItems();
    }, 100);
  }

  ngOnInit() {
    // Ensure translations are fully loaded before setting menu items
    this.translocoService
      .load(this.translocoService.getActiveLang())
      .subscribe(() => {
        // Once translations are ready, initialize menu items
        this.updateMenuItems();

        // Listen to router events and update `currentUrl` and menu items
        this.router.events
          .pipe(filter((event) => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.currentUrl = event.url; // Update `currentUrl`
            this.updateMenuItems(); // Refresh menu items
          });

        // Subscribe to breakpoint observer for mobile and medium device logic
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
      });
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
    this.translocoService.langChanges$.subscribe(() => {
      this.items = [
        {
          label: 'Home',
          route: '/',
          icon: this.activeIcon('/'),
          command: () => this.navigateTo('/'),
        },
        {
          label: this.translocoService.translate('navbarComponent.search'),
          route: '/search',
          icon: this.activeIcon('/search'),
          command: () => this.navigateTo('/search'),
        },
        {
          label: this.translocoService.translate('navbarComponent.createEvent'),
          route: '/create-event',
          icon: 'add-line',
          command: () => this.navigateTo('/create-event'),
        },
        {
          label: this.translocoService.translate('navbarComponent.myEvents'),
          route: '/my-events',
          icon: this.activeIcon('/my-events'),
          command: () => this.navigateTo('/my-events'),
        },
        {
          label: this.translocoService.translate('navbarComponent.mySpace'),
          route: '/my-space',
          icon: this.activeIcon('/my-space'),
          command: () => this.navigateTo('/my-space'),
        },
      ];
    });
  }
}
