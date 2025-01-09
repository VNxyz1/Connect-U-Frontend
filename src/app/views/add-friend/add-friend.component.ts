import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePageComponent } from '../profile-page/profile-page.component';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FriendsService } from '../../services/friends/friends.service';

const ERROR_MESSAGE_MAPPING: Record<string, string> = {
  'Your invite link is not correct or expired':
    'addFriendComponent.errors.invalidInviteLink',
  'You cannot befriend yourself': 'addFriendComponent.errors.self',
  'Invitation link doesnt exist':
    'addFriendComponent.errors.invitationLinkNotExists',
};

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [
    ProfilePageComponent,
    AngularRemixIconComponent,
    Button,
    PrimeTemplate,
    TranslocoPipe,
  ],
  templateUrl: './add-friend.component.html',
})
export class AddFriendComponent implements OnInit {
  username!: string;
  inviteId!: string;
  isAlreadyFriend: boolean = false;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly friendsService: FriendsService,
    protected messageService: MessageService,
    protected readonly translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.inviteId = this.route.snapshot.paramMap.get('inviteId')!;

    if (!this.inviteId || !this.username) {
      this.router.navigate(['/404']);
    } else {
      // Check if the user is already a friend
      this.friendsService.checkIfFriend(this.username).subscribe(isFriend => {
        this.isAlreadyFriend = isFriend;
      });
    }
  }

  protected acceptFriendInvite() {
    this.friendsService
      .createFriendship(this.username, this.inviteId)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate(
              'addFriendComponent.friendship-created',
              { name: this.username },
            ),
          });
        },
        error: err => this.handleError(err),
      });
  }

  private handleError(err: any): void {
    const translationKey =
      ERROR_MESSAGE_MAPPING[err.error?.message] ||
      'addFriendComponent.errors.genericError';

    const translatedMessage = this.translocoService.translate(translationKey);

    this.messageService.add({
      severity: 'error',
      summary: translatedMessage,
    });
  }
}
