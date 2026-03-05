import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

import { LucideAngularModule, Users, Package, ReceiptText, Dices, Shapes } from 'lucide-angular';

interface NavItem {
  label: string;
  icon:  any;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatRippleModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  standalone: true,
})
export class Sidebar {
  readonly collapsed = input(false);

  readonly navItems: NavItem[] = [
    { label: 'Préstamos', icon: Package, route: '/prestamos' },
    { label: 'Juegos', icon: Dices, route: '/juegos' },
    { label: 'Clientes', icon: Users, route: '/clientes' },
    { label: 'Categorías', icon: Shapes, route: '/categorías' }
  ];
}
