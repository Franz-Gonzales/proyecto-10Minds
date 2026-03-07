import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/components/sidebar/sidebar';
import { Topbar } from '../shared/components/topbar/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './main-layout.html',
})
export class MainLayout {
  readonly sidebarCollapsed = signal(false);
  readonly sidebarOpen = signal(false); // For mobile overlay

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.sidebarOpen.set(false);
      this.sidebarCollapsed.set(true);
    }
  }

  toggleSidebar(): void {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.sidebarOpen.update((v) => !v);
    } else {
      this.sidebarCollapsed.update((v) => !v);
    }
  }

  closeMobileSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
