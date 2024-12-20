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
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { SocketService } from '../../../services/socket/socket.service';
import { filter } from 'rxjs/operators';

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

  private userScrolled: boolean = false;
  private socketSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private chatService: EventChatService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private sockets: SocketService,
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
        console.log('Socket received: updateChatMessages');
        this.getNewMessages();
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
    this.messages$ = undefined!;

    console.log('Cleanup called: Unsubscribed and cleaned up sockets and chatSubject');
  }


  private markMessagesAsRead() {
    this.chatService.markMessagesAsRead(this.eventId).subscribe({
      next: () => console.log('Messages marked as read'),
      error: err => console.error('Error marking messages as read', err),
    });

  }

  private getNewMessages(): void {
    this.chatService.getMessages(this.eventId).subscribe({
      next: res => {
        console.log(res);
        if (!this._chatSubject$) {
          // Initialize BehaviorSubject if not already done
          this._chatSubject$ = new BehaviorSubject<EventMessagesResponse>(res);
          this.messages$ = this._chatSubject$.asObservable();
        } else {
          // Update BehaviorSubject with the new data
          this._chatSubject$.next(res);
        }

        // Log unread messages
        console.log('Unread Messages:', res.unreadMessages);
        console.log('Read Messages:', res.readMessages);

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
      console.log('scrollToBottom');
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  protected sendMessage(): void {
    this.markMessagesAsRead();
    if (this.newMessage.trim()) {
      console.log(this.newMessage);
      this.chatService.postChatMessage(this.eventId, this.newMessage).subscribe({
        next: res => {
          this.newMessage = ''; // Clear the input field
          this.getNewMessages(); // Refresh messages

        },
        error: err => {
          const errorDictionary: Record<string, string> = {
            'Content is required': 'eventChatPage.errors.required',
            'Content must not exceed 65000 characters': 'eventChatPage.errors.too-long',
            'Content must not be empty or contain only whitespace': 'eventChatPage.errors.empty',
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
