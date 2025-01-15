import {Component, OnInit} from '@angular/core';
import {ProfileCardComponent} from '../../components/profile-card/profile-card.component';
import {Observable} from 'rxjs';
import {ProfileData} from '../../interfaces/ProfileData';
import {FriendsService} from '../../services/friends/friends.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [
    ProfileCardComponent,
    AsyncPipe
  ],
  templateUrl: './my-friends.component.html'
})
export class MyFriendsComponent implements OnInit {
  friends$!:Observable<ProfileData[]>;
  constructor(private friendsService: FriendsService) {}

  ngOnInit(){
    this.friends$ = this.friendsService.getFriends();

    // Debug: Inhalte in der Konsole anzeigen
    this.friends$.subscribe({
      next: (data) => console.log('Fetched Friends:', data),
      error: (err) => console.error('Error fetching friends:', err)
    });
  }

}
