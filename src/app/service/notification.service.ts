import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private socket: Socket) {}

  notifications() {
    return this.socket.fromEvent('notification').pipe(map((data: any) => data));
  }
}
