import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { UserService } from '../../services/user/user.service';
import { AsyncPipe } from '@angular/common';
import { CountdownPipe } from '../../utils/pipes/countdown.pipe';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button, ButtonDirective } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { QRCodeModule } from 'angularx-qrcode';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-qr-code-and-link',
  standalone: true,
  imports: [
    CardModule,
    AsyncPipe,
    CountdownPipe,
    AngularRemixIconComponent,
    Button,
    InputGroupModule,
    InputTextModule,
    ButtonDirective,
    QRCodeModule,
    SkeletonModule,
    TranslocoPipe,
  ],
  templateUrl: './qr-code-and-link.component.html',
})
export class QrCodeAndLinkComponent implements OnInit {
  constructor(
    protected userService: UserService,
    private clip: Clipboard,
    private message: MessageService,
    private translocoService: TranslocoService,
  ) {}

  async ngOnInit() {
    const hasActiveLink = await this.userService.hasActiveLink();
    if (hasActiveLink) {
      await this.userService.loadStoredInviteLink();
    } else {
      this.setInviteLink();
    }
  }

  setInviteLink() {
    this.userService.startInviteLinkGeneration();
  }

  handleRefreshClick() {
    this.setInviteLink();
  }

  handleSubmitCopy($event: SubmitEvent, content: string) {
    $event.preventDefault();
    this.clip.copy(content);
    this.message.add({
      severity: 'info',
      detail: this.translocoService.translate(
        'shareProfilePage.successfullyCopiedMessage',
      ),
    });
  }
}
