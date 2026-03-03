import { Component, signal } from '@angular/core';
import { PageHeader } from "../../../../shared/components/page-header/page-header";
import { ClientFilter } from "../../components/client-filter/client-filter";

@Component({
  selector: 'app-client-page',
  imports: [PageHeader, ClientFilter],
  templateUrl: './client-page.html',
})
export default class ClientPage {

  readonly searchTerm = signal('');

  openCreateDialog(): void {
    // Lógica para abrir el diálogo de creación de cliente
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }
}
