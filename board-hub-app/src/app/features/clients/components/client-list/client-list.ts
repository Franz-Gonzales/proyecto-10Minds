import { Component, input, output, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { Client, PageInfo } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './client-list.html',

  styleUrl: './client-list.css',
})
export class ClientList implements OnChanges, AfterViewInit {
  readonly clients = input.required<Client[]>();
  readonly pageInfo = input.required<PageInfo>();
  readonly loading = input<boolean>(false);

  readonly edit = output<Client>();
  readonly delete = output<Client>();
  readonly pageChange = output<PageEvent>();
  readonly sortChange = output<Sort>();
  readonly searchChange = output<string>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'index',
    'client',
    'phoneNumber',
    'email',
    'activeLoans',
    'totalHistoric',
    'actions',
  ];

  dataSource = new MatTableDataSource<Client>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clients']) {
      this.dataSource.data = this.clients(); // Alimenta la tabla con los datos del server
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchChange.emit(filterValue.trim());
  }



  ngAfterViewInit(): void {
    // We don't connect sort/paginator to dataSource because
    // pagination and sorting happen server-side
  }


  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }


  onSortChange(sortState: Sort): void {
    this.sortChange.emit(sortState);
  }

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

  getRowIndex(index: number): number {
      const pi = this.pageInfo();
      return (pi.currentPage - 1) * pi.itemsPerPage + index + 1;
  }
  // Página 3, limit 10, fila index 0 → (3-1)*10 + 0 + 1 = 21
  // Página 3, limit 10, fila index 9 → (3-1)*10 + 9 + 1 = 30
}
