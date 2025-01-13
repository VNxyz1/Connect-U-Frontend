import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EventService } from '../../services/event/eventservice';
import { AuthService } from '../../services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

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
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  currentUrl: string | undefined;

  isLoggedIn!: Observable<boolean>;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    protected translocoService: TranslocoService,
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.isLoggedIn = this.authService.isLoggedIn();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
      });
  }

  protected backToLast() {
    window.history.back(); // Navigate to the previous page in the browser history
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
        this.eventService.removeEventInformation().then(() => {
          this.router.navigate(['/']);
        });
      },
      reject: () => {
        return;
      },
    });
  }
}
