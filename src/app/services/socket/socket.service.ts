import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;
  private readonly url: string = environment.apiConfig.socketUrl;
  private socketInitialized: boolean = false;

  constructor() {}

  public init(): void {
    if (!this.socketInitialized) {
      this.socket = io(this.url, {
        autoConnect: true,
      });
      this.socketInitialized = true;
    }
  }

  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket is not initialized.');
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
