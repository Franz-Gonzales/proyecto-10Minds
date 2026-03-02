import { Component, output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './topbar.html',
})
export class Topbar {
  readonly toggleSidebar = output<void>();
}
