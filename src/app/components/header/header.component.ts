import { Component, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ImageModule,
    AngularRemixIconComponent,
    Button,
    NgClass,
    TranslocoPipe,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  currentUrl: string | undefined;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit() {
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
        this.router.navigate(['/']);
      },
      reject: () => {
        return;
      },
    });
  }
}
