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
import {map} from 'rxjs/operators';

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
  profileData$!: Observable<{ userProfile: ProfileData; imageUrl: string }>;
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
    this.userService.getUserData().subscribe((userData) => {
      const userId = userData.id;

      this.profileData$ = this.userService.getSpecificUserData(userId).pipe(
        map((data) => {
          console.log("Fetched User Data:", data);
          const profilePicture = data.profilePicture
            ? this.userService.getImageFile(data.profilePicture)
            : this.userService.getImageFile('empty.png');
          console.log("Profile Picture URL:", profilePicture);

          return {
            userProfile: data,
            imageUrl: profilePicture,
          };
        })
      );
    });
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
        this.router.navigate(['/']).then(() => window.location.reload());
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
