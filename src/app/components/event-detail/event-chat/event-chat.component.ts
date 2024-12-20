import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventMessagesResponse } from '../../../interfaces/Messages';
import { EventChatService } from '../../../services/event/event-chat.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { EventMessageComponent } from './event-message/event-message.component';
import { SkeletonModule } from 'primeng/skeleton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-event-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    InputGroupModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    EventMessageComponent,
    NgClass,
    SkeletonModule,
    FloatLabelModule,
    AngularRemixIconComponent,
    Button,
    TranslocoPipe,
  ],
  templateUrl: './event-chat.component.html',
})
export class EventChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  private eventId!: string;
  private _chatSubject$!: BehaviorSubject<EventMessagesResponse>;
  messages$!: Observable<EventMessagesResponse>;
  newMessage!: string;

  constructor(
    private chatService: EventChatService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private sockets: SocketService,
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.chatService.getMessages(this.eventId).subscribe({
      next: res => {
        this._chatSubject$ = new BehaviorSubject<EventMessagesResponse>(res);
        this.messages$ = this._chatSubject$.asObservable();
        setTimeout(() => this.scrollToBottom(), 10);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 0);
  }

  ngOnDestroy() {
    this.markMessagesAsRead();
    this._chatSubject$.unsubscribe();
  }

  private markMessagesAsRead() {
    this.chatService.markMessagesAsRead(this.eventId).subscribe({});
  }

  private getNewMessages(): void {
    this.chatService.getMessages(this.eventId).subscribe({
      next: res => {
        this._chatSubject$.next(res);

        // Wait for Angular to render and detect changes, then scroll
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 0);
      },
    });
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      console.log('scrollToBottom');
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  protected sendMessage(): void {
    if (this.newMessage.trim()) {
      console.log(this.newMessage);
      this.chatService.postChatMessage(this.eventId, this.newMessage).subscribe({
        next: (res) => {
          // Message posted successfully, clear input field
          this.newMessage = '';
        },
        error: (err) => {
          // Handle error based on a predefined dictionary
          const errorDictionary: Record<string, string> = {
            'Content is required': 'eventChatPage.errors.required',
            'Content must not exceed 65000 characters': 'eventChatPage.errors.too-long',
            'Content must not be empty or contain only whitespace': 'eventChatPage.errors.empty',
            'Messages cannot contain links': 'eventChatPage.errors.no-links',
          };

          // Extract error message from the response
          const serverMessage = err?.error?.message || 'Unknown error';
          const translationKey =
            errorDictionary[serverMessage] || 'eventChatPage.errors.generic';

          // Add translated error to the message service
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate(translationKey),
          });

        },
      });
    }
  }
}
