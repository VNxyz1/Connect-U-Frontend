import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EventService } from '../../services/event/eventservice';
import { AuthService } from '../../services/auth/auth.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { CurrentUrlService } from '../../services/current-url/current-url.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ImageModule,
    AngularRemixIconComponent,
    Button,
    TranslocoPipe,
    ConfirmDialogModule,
    RouterLink,
    AsyncPipe,
    NgClass,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  currentUrl$!: Observable<string>;
  params: Params = { page: 1 };
  isIosPlatform = Capacitor.getPlatform() === 'ios';

  isLoggedIn!: Observable<boolean>;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    protected translocoService: TranslocoService,
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private currentUrl: CurrentUrlService,
  ) {
    console.log(Capacitor.getPlatform());
  }

  ngOnInit() {
    this.currentUrl$ = this.currentUrl.get();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  search = () => {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
    this.router.navigate(['search'], { queryParams: this.params });
  };

  protected backToLast() {
    window.history.back();
  }

  protected closeProcess() {
    this.confirmationService.confirm({
      message: this.translocoService.translate(
        'headerComponent.closeConfirmationMessage',
      ),
      header: this.translocoService.translate(
        'headerComponent.closeConfirmationHeader',
      ),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eventService.removeEventImage();
        this.eventService.removeEventInformation().then(() => {
          this.router.navigate(['/']);
        });
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
        return;
      },
    });
  }

  protected readonly Capacitor = Capacitor;
}
