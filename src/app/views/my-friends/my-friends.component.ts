import { Component, OnInit } from '@angular/core';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { Observable } from 'rxjs';
import { ProfileData } from '../../interfaces/ProfileData';
import { FriendsService } from '../../services/friends/friends.service';
import { AsyncPipe } from '@angular/common';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [ProfileCardComponent, AsyncPipe, CardModule],
  templateUrl: './my-friends.component.html',
})
export class MyFriendsComponent implements OnInit {
  friends$!: Observable<ProfileData[]>;
  constructor(private friendsService: FriendsService) {}

  ngOnInit() {
    this.friends$ = this.friendsService.getFriends();
  }
}
