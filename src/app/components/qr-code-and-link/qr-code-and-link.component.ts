import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { UserService } from '../../services/user/user.service';
import { AsyncPipe } from '@angular/common';
import { CountdownPipe } from '../../utils/pipes/countdown.pipe';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-qr-code-and-link',
  standalone: true,
  imports: [
    CardModule,
    AsyncPipe,
    CountdownPipe,
    AngularRemixIconComponent,
    Button,
  ],
  templateUrl: './qr-code-and-link.component.html',
})
export class QrCodeAndLinkComponent {
  constructor(protected userService: UserService) {}

  setInviteLink() {
    this.userService.getInviteLink().subscribe(inviteLink => {
      this.userService.setInviteLink(inviteLink.inviteLink, inviteLink.ttl);
    });
  }

  handleRefreshClick() {
    this.setInviteLink();
  }
}
