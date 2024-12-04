import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { ProfileData } from '../../interfaces/ProfileData';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-space-page',
  standalone: true,
  imports: [
    CardModule,
    AngularRemixIconComponent,
    ProfileCardComponent,
    TranslocoPipe,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './my-space-page.component.html',
})
export class MySpacePageComponent implements OnInit {
  profileData$!: Observable<ProfileData>;

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
  ) {}
  async ngOnInit(): Promise<void> {
    this.getProfileData();
  }

  getProfileData() {
    this.profileData$ = this.userService.getUserData();
  }

  handleLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate(
            'logout.messages.success.summary',
          ),
          detail: this.translocoService.translate(
            'logout.messages.success.detail',
          ),
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate(
            'logout.messages.error.summary',
          ),
          detail: this.translocoService.translate(
            'logout.messages.error.detail',
          ),
        });
      },
    });
  }
}
