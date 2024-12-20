import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventMessagesResponse } from '../../../interfaces/Messages';
import { EventChatService } from '../../../services/event/event-chat.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { EventMessageComponent } from './event-message/event-message.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-event-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    InputGroupModule,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,

    TranslocoPipe,
    EventMessageComponent,
    NgClass,
    SkeletonModule,
  ],
  templateUrl: './event-chat.component.html',
})
export class EventChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  private eventId!: string;
  private _chatSubject$!: BehaviorSubject<EventMessagesResponse>;
  messages$!: Observable<EventMessagesResponse>;

  constructor(
    private chatService: EventChatService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
}

