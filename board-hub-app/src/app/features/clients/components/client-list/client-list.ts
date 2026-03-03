import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  imports: [MatIconModule, MatMenuModule, MatButtonModule, MatTooltipModule],
  templateUrl: './client-list.html',
})
export class ClientList {
  readonly clients = input.required<Client[]>();

  readonly edit = output<Client>();
  readonly delete = output<Client>();

  getInitials(name: string, lastName: string): string {
    const first = name.charAt(0).toUpperCase();
    const last = lastName.charAt(0).toUpperCase();
    return `${first}${last}`;
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-blue-600/20 text-blue-400 border-blue-500/30',
      'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
      'bg-purple-600/20 text-purple-400 border-purple-500/30',
      'bg-amber-600/20 text-amber-400 border-amber-500/30',
      'bg-rose-600/20 text-rose-400 border-rose-500/30',
      'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
    ];
    if (!name) {
      return colors[0];
    }
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
