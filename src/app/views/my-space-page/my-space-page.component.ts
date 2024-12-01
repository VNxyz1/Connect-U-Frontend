import {Component, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {AngularRemixIconComponent} from 'angular-remix-icon';
import {ProfileCardComponent} from '../../components/profile-card/profile-card.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {RouterLink} from '@angular/router';
import {ProfileData} from '../../interfaces/ProfileData';
import {Observable} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-my-space-page',
  standalone: true,
  imports: [
    CardModule,
    AngularRemixIconComponent,
    ProfileCardComponent,
    TranslocoPipe,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './my-space-page.component.html',
})
export class MySpacePageComponent implements OnInit {
  profileData$!: Observable<ProfileData>

  constructor(private userService: UserService) {
  }
  async ngOnInit(): Promise<void> {
    this.getProfileData();
  }

  getProfileData(){
    this.profileData$ = this.userService.getUserData();
  }

}
