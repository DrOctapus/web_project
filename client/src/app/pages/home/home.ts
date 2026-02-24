import { Component, OnInit, viewChild, signal, inject, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  suggestedBooks = signal<any[]>([]);
  categories = signal<any[]>([]);

  readonly horizontalMenu = viewChild<ElementRef>('horizontalMenuContainer');

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.getBooks(6).subscribe({
      next: (response) => {
        if (response.success) {
          this.suggestedBooks.set(response.data);
        }
      },
      error: (err) => console.error('Error loading books:', err)
    });

    this.apiService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories.set(response.data);
        }
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  ngAfterViewInit() {

    const horizontal = this.horizontalMenu()?.nativeElement;

    if (horizontal) {
      horizontal.addEventListener('wheel', (e: WheelEvent) => {
        if (e.deltaY === 0) return;

        e.preventDefault();

        horizontal.scrollLeft += e.deltaY / 4;
      }, { passive: false });
    }
  }
}