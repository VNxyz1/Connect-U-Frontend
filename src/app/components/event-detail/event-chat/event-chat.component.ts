import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EventMessagesResponse } from '../../../interfaces/Messages';
import { EventChatService } from '../../../services/event/event-chat.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { MessageService } from 'primeng/api';
import { SocketService } from '../../../services/socket/socket.service';
import { filter } from 'rxjs/operators';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PushNotificationService } from '../../../services/push-notification/push-notification.service';

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
    TranslocoPipe,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './event-chat.component.html',
})
export class EventChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  private eventId!: string;
  private _chatSubject$!: BehaviorSubject<EventMessagesResponse>;
  messages$!: Observable<EventMessagesResponse>;
  newMessage: string = '';

  private userScrolled: boolean = false;
  private socketSubscription!: Subscription;
  private routeSubscription!: Subscription;
  initialLoad = true;

  constructor(
    private chatService: EventChatService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private sockets: SocketService,
    private pushNotificationService: PushNotificationService,
  ) {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.getNewMessages();
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.getNewMessages();

    // Subscribe to socket updates
    this.socketSubscription = this.sockets.on('updateChatMessages').subscribe({
      next: () => {
        this.getNewMessages();
        this.initialLoad = false;
      },
    });

    // Detect navigation and clean up if navigating away
    this.routeSubscription = this.router.events
      .pipe(filter(event => event.constructor.name === 'NavigationStart'))
      .subscribe(() => {
        this.cleanup();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 0);

    // Detect user scroll to prevent marking messages as read too early
    this.chatContainer.nativeElement.addEventListener('scroll', () => {
      const container = this.chatContainer.nativeElement;
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        this.userScrolled = true;
      }
    });
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.userScrolled) {
      this.markMessagesAsRead();
    }
    // Unsubscribe from socket and route events
    this.socketSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();

    // Complete and nullify the chat subject
    this._chatSubject$?.complete();

    // Nullify messages observable
    this.initialLoad = true;
    this.messages$ = undefined!;
  }

  private markMessagesAsRead() {
    this.chatService.markMessagesAsRead(this.eventId).subscribe({});
    this.pushNotificationService.clearEvent(this.eventId);
  }

  private getNewMessages(): void {
    this.chatService.getMessages(this.eventId).subscribe({
      next: res => {
        if (!this._chatSubject$) {
          // Initialize BehaviorSubject if not already done
          this._chatSubject$ = new BehaviorSubject<EventMessagesResponse>(res);
          this.messages$ = this._chatSubject$.asObservable();
        } else {
          // Update BehaviorSubject with the new data
          this._chatSubject$.next(res);
          this.markMessagesAsRead();
        }

        // Wait for Angular to render and detect changes, then scroll
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: err => {
        console.error('Error fetching messages:', err);
      },
    });
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  protected sendMessage(): void {
    this.markMessagesAsRead();
    if (this.newMessage.trim()) {
      this.chatService
        .postChatMessage(this.eventId, this.newMessage)
        .subscribe({
          next: res => {
            this.newMessage = ''; // Clear the input field
            this.getNewMessages(); // Refresh messages
            this.markMessagesAsRead();
          },
          error: err => {
            const errorDictionary: Record<string, string> = {
              'Content is required': 'eventChatPage.errors.required',
              'Content must not exceed 65000 characters':
                'eventChatPage.errors.too-long',
              'Content must not be empty or contain only whitespace':
                'eventChatPage.errors.empty',
              'Messages cannot contain links': 'eventChatPage.errors.no-links',
            };

            const serverMessage = err?.error?.message || 'Unknown error';
            const translationKey =
              errorDictionary[serverMessage] || 'eventChatPage.errors.generic';

            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate(translationKey),
            });
          },
        });
    }
  }
}
