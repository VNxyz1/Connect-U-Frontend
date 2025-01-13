import { Component, OnInit } from '@angular/core';
import { QrCodeAndLinkComponent } from '../../components/qr-code-and-link/qr-code-and-link.component';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { EventInfoComponent } from '../../components/event-detail/event-info/event-info.component';
import { CameraComponent } from '../../components/camera/camera.component';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-share-profile',
  standalone: true,
  imports: [QrCodeAndLinkComponent, AngularRemixIconComponent, PrimeTemplate, TabMenuModule, EventInfoComponent, CameraComponent],
  templateUrl: './share-profile-page.component.html',
})
export class ShareProfilePageComponent implements OnInit {
  activeTabItem!: MenuItem;
  tabMenuItems!: MenuItem[];

  constructor(
    private readonly translocoService: TranslocoService,
  ){

  }

  ngOnInit() {
    this.setupTabs();
  }

  private setupTabs(): void {
    this.translocoService
      .selectTranslation()
      .subscribe((translations: Record<string, string>) => {
        this.tabMenuItems = [
          {
            label: translations['shareProfilePage.share'],
            icon: 'qr-code-line',
            id: 'share',
            command: () => {
              this.onActiveItemChange(this.tabMenuItems[0]);
            },
          },
          {
            label: translations['shareProfilePage.scan'],
            icon: 'qr-scan-2-line',
            id: 'scan',
            command: () => {
              this.onActiveItemChange(this.tabMenuItems[1]);
            }
          }
        ];
        this.activeTabItem = this.tabMenuItems[0];
    });

  }

  protected onActiveItemChange(newActiveItem: MenuItem): void {
    this.activeTabItem = newActiveItem;
  }
}
