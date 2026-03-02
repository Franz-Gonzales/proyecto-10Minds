import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly collapsed = input(false);

  readonly navItems: NavItem[] = [
    { label: 'Préstamos', icon: 'receipt_long', route: '/prestamos' },
    { label: 'Juegos', icon: 'sports_esports', route: '/juegos' },
    { label: 'Clientes', icon: 'people', route: '/clientes' },
  ];
}
