import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { EventMessage } from '../../../../interfaces/Messages';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { NgClass } from '@angular/common';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-event-message',
  standalone: true,
  imports: [AvatarModule, TranslocoPipe, AngularRemixIconComponent, NgClass],
  templateUrl: './event-message.component.html',
})
export class EventMessageComponent {
  @Input() message!: EventMessage;

  constructor(
    protected readonly translocoService: TranslocoService,
    protected userService: UserService,
  ) {}

  protected isShortEmojiOnly(text: string) {
    if (!text) return false; // Handle empty strings

    // Regex to match individual emojis
    const emojiRegex = /\p{Emoji_Presentation}/gu;

    // Find all emoji matches
    const emojiMatches = text.match(emojiRegex);

    // Return true if only emojis are present AND there are 1 to 3 emojis
    return (
      !!emojiMatches && // Ensure there are matches
      emojiMatches.length > 0 &&
      emojiMatches.length <= 3 &&
      text.trim().length === emojiMatches.join('').length // Ensure no non-emoji content
    );
  }

  protected getTimestamp(messageTimestamp: string): string {
    const messageDate = new Date(messageTimestamp);
    const currentDate = new Date();

    // Check if the message is from today
    const isToday =
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear();

    if (isToday) {
      // If today, return time in HH:mm format
      return messageDate.toLocaleTimeString(
        this.translocoService.getActiveLang(),
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      );
    } else {
      // Otherwise, return date in dd.MM format
      return messageDate.toLocaleDateString(
        this.translocoService.getActiveLang(),
        {
          day: '2-digit',
          month: '2-digit',
        },
      );
    }
  }

  protected translateMessageText(text: string): string {
    try {
      const parsed = JSON.parse(text);
      if (parsed.key && parsed.params) {
        return this.translocoService.translate(parsed.key, parsed.params);
      }
    } catch {
      // If not JSON, return the text directly
      return text;
    }
    return text;
  }
}
