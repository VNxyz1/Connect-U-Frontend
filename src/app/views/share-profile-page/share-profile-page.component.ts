import { Component, OnInit } from '@angular/core';
import { QrCodeAndLinkComponent } from '../../components/qr-code-and-link/qr-code-and-link.component';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { TranslocoService } from '@jsverse/transloco';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-share-profile',
  standalone: true,
  imports: [
    QrCodeAndLinkComponent,
    AngularRemixIconComponent,
    PrimeTemplate,
    TabMenuModule,
  ],
  templateUrl: './share-profile-page.component.html',
})
export class ShareProfilePageComponent implements OnInit {
  activeTabItem!: MenuItem;
  tabMenuItems!: MenuItem[];
  private routeSubscription!: Subscription;

  constructor(
    private readonly translocoService: TranslocoService,
    protected router: Router,
  ) {}

  ngOnInit() {
    this.setupTabs();
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeTabItem = this.getActiveTabItem();
      }
    });
  }

  private setupTabs(): void {
    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.tabMenuItems = [
          {
            label: translations['shareProfilePage.tab-share'],
            icon: 'qr-code-line',
            route: `/share-profile/`,
            id: 'share',
            command: () => {
              this.onActiveItemChange(this.tabMenuItems[0]);
            },
          },
          {
            label: translations['shareProfilePage.tab-scan'],
            icon: 'qr-scan-2-line',
            route: `/share-profile/scan-qr`,
            id: 'scan',
            command: () => {
              this.onActiveItemChange(this.tabMenuItems[1]);
            },
          },
        ];
        this.activeTabItem = this.getActiveTabItem();
      });
  }

  protected onActiveItemChange(newActiveItem: MenuItem): void {
    this.activeTabItem = newActiveItem;
  }

  protected getActiveTabItem(): MenuItem {
    if (this.router.url.includes('/scan-qr')) {
      return this.tabMenuItems[1]; // Select the first tab
    } else {
      // Default navigation to '/share-profile/share-link'
      return this.tabMenuItems[0]; // Return the first tab as default
    }
  }
}
