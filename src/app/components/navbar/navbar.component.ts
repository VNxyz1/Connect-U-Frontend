import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
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
import { TranslocoService } from '@jsverse/transloco';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

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
    DropdownModule,
    FormsModule,
    LanguageSelectorComponent,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Input() currentUrl: string | null = null;
  items: MenuItem[] = [];
  isMd: boolean = false;
  isMobile: boolean = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private translocoService: TranslocoService,
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) {
    setTimeout(() => {
      this.updateMenuItems();
    }, 100);
  }

  ngOnInit() {
    this.translocoService
      .load(this.translocoService.getActiveLang())
      .subscribe(() => {
        this.updateMenuItems();

        this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.currentUrl = event.url;
            this.updateMenuItems();
          });

        this.breakpointObserver
          .observe([Breakpoints.Handset, '(max-width: 1085px)'])
          .subscribe(result => {
            const breakpoints = result.breakpoints;
            this.isMobile = breakpoints[Breakpoints.Handset] || false;
            this.isMd = breakpoints['(max-width: 1085px)'] || false;
          });
      });
  }

  ngAfterViewInit() {
    this.setPaddingForFixedFooter();
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
  }

  activeIcon(path: string): any {
    const iconBaseMap: { [key: string]: string } = {
      '/': 'home-2',
      '/search': 'search',
      '/create-event/step1': 'add',
      '/my-events': 'function',
      '/my-space': 'user-3',
      '/share-profile': 'qr-scan-2',
    };

    const baseIcon = iconBaseMap[path];

    return this.currentUrl === path ? `${baseIcon}-fill` : `${baseIcon}-line`;
  }

  private updateMenuItems() {
    const translationKeys = [
      'navbarComponent.search',
      'navbarComponent.createEvent',
      'navbarComponent.myEvents',
      'navbarComponent.mySpace',
    ];

    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.items = [
          {
            label: 'Home',
            route: '/',
            icon: this.activeIcon('/'),
            command: () => this.navigateTo('/'),
          },
          {
            label: translations['navbarComponent.search'],
            route: '/search',
            icon: this.activeIcon('/search'),
            command: () => this.navigateTo('/search'),
          },
          {
            label: translations['navbarComponent.createEvent'],
            route: '/create-event/step1',
            icon: 'add-line',
            command: () => this.navigateTo('/create-event/step1'),
          },
          {
            label: translations['navbarComponent.myEvents'],
            route: '/my-events',
            icon: this.activeIcon('/my-events'),
            command: () => this.navigateTo('/my-events'),
          },
          {
            label: translations['navbarComponent.shareProfile'],
            route: '/share-profile',
            icon: this.activeIcon('/share-profile'),
            command: () => this.navigateTo('/share-profile'),
          },
          {
            label: translations['navbarComponent.mySpace'],
            route: '/my-space',
            icon: this.activeIcon('/my-space'),
            command: () => this.navigateTo('/my-space'),
          },
        ];
      });
  }

  setPaddingForFixedFooter = (): void => {
    const fixedFooter = this.elRef.nativeElement.querySelector('.fixed-footer');
    if (fixedFooter) {
      const footerHeight = fixedFooter.offsetHeight;

      this.renderer.setStyle(fixedFooter, 'padding-top', `${footerHeight}px`);
    }
  };
}
