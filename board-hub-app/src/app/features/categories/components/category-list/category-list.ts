import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { Category } from '../../models/category.model';
import { DatePipe } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { Chip } from "../../../../shared/components/chips/chips";
import { Button } from "../../../../shared/components/buttons/buttons";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,
    MatChipsModule,
    Chip,
    Button,
    MatMenu,
    MatMenuTrigger
],
  templateUrl: './category-list.html',
})
export class CategoryList {

  readonly categories = input.required<Category[]>();

  readonly edit = output<Category>();
  readonly delete = output<Category>();
  readonly activate = output<Category>();

  displayedColumns: string[] = ['index', 'category', 'description', 'status', 'createdAt', 'actions'];
}
