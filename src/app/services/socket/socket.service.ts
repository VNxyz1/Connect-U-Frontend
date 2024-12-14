import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly url: string = environment.apiConfig.socketUrl;
  private socketInitialized: boolean = false;

  constructor() {
    this.socket = io(this.url, {
      autoConnect: true,
    });
    this.socketInitialized = true;
  }

  connectUser(userId: string): void {
    this.emit('handleConnect', userId);
  }

  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket is not initialized.');
    }
    return this.socket;
  }

  on(eventName: string): Observable<any> {
    return new Observable<any>(observer => {
      const socket = this.getSocket();
      socket.on(eventName, (data: any) => {
        observer.next(data);
      });
      return () => socket.off(eventName);
    });
  }

  emit(eventName: string, data: any): void {
    const socket = this.getSocket();
    socket.emit(eventName, data);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
