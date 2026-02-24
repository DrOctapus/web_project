import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Data Signals
  coursesList = signal<any[]>([]);
  categories = signal<any[]>([]);

  // TODO dynamic
  limitDuration = 20;
  readonly limitDifficulty = 3;

  // Filter State
  searchQuery = '';
  maxDuration = 20;
  maxDifficulty = 3;
  enableDuration = false;
  enableDifficulty = false;

  selectedCategories = new Set<string>();

  // UI State
  isFilterMenuOpen = signal(false);

  difficultyMap: any = {
    1: { label: "Beginner", color: "#28a745" },
    2: { label: "Intermediate", color: "#fd7e14" },
    3: { label: "Advanced", color: "#dc3545" }
  };

  ngOnInit() {
    this.fetchCategories();

    this.fetchLimits();

    this.route.queryParams.subscribe(params => {
      this.selectedCategories.clear();
      this.searchQuery = params['title'] || '';

      const incomingCategory = params['category'] || params['courseCategory'];

      if (incomingCategory) {
        const cats = Array.isArray(incomingCategory) ? incomingCategory : [incomingCategory];
        cats.forEach((c: string) => this.selectedCategories.add(c));
      }

      if (params['maxDuration']) {
        this.maxDuration = Number(params['maxDuration']);
        this.enableDuration = true;
      } else {
        this.enableDuration = false;
        this.maxDuration = this.limitDuration; // Reset to limit
      }

      if (params['maxDifficulty']) {
        this.maxDifficulty = Number(params['maxDifficulty']);
        this.enableDifficulty = true;
      } else {
        this.enableDifficulty = false;
        this.maxDifficulty = this.limitDifficulty; // Reset to limit
      }

      const apiFilters: any = {};

      if (this.selectedCategories.size > 0) {
        apiFilters.category = Array.from(this.selectedCategories);
      }

      if (this.searchQuery) {
        apiFilters.title = this.searchQuery;
      }

      if (this.enableDuration) {
        apiFilters.maxDuration = this.maxDuration;
      }

      if (this.enableDifficulty) {
        apiFilters.maxDifficulty = this.maxDifficulty;
      }

      this.fetchCourses(apiFilters);
    });
  }

  fetchCategories() {
    this.apiService.getCategories().subscribe({
      next: (res) => {
        if (res.success) this.categories.set(res.data);
      },
      error: (err) => console.error('Error categories:', err)
    });
  }

  fetchLimits() {
    // Fetch all courses to find max values
    this.apiService.getCourses().subscribe({
      next: (res) => {
        if (res.success && res.data.length > 0) {
          const maxDur = Math.max(...res.data.map((c: any) => c.duration || 0));
          this.limitDuration = maxDur;

          if (!this.enableDuration) this.maxDuration = this.limitDuration;
        }
      },
      error: (err) => console.error('Error fetching limits:', err)
    });
  }

  fetchCourses(filters: any) {
    this.apiService.getCourses(filters).subscribe({
      next: (res) => {
        if (res.success) this.coursesList.set(res.data);
        if (Object.keys(filters).length === 0) {
          this.resetFilters();
        }
      },
      error: (err) => console.error('Error courses:', err)
    });
  }

  // UI Handlers
  toggleFilters() {
    const newFilterState = !this.isFilterMenuOpen();
    this.isFilterMenuOpen.set(newFilterState);

    if (newFilterState) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }
  closeFilters() {
    this.isFilterMenuOpen.set(false);
    document.body.classList.remove("no-scroll");
  }

  updateCategory(categoryId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.add(categoryId);
    } else {
      this.selectedCategories.delete(categoryId);
    }
  }

  getCategoryName(id: string): string {
    const cat = this.categories().find(c => c._id === id);
    return cat ? cat.name : id;
  }

  getDifficultyInfo(difficulty: number) {
    return this.difficultyMap[difficulty] || { label: "Unknown", color: "#333" };
  }

  applyFilters() {
    const queryParams: any = {};

    if (this.searchQuery) queryParams.title = this.searchQuery;

    if (this.selectedCategories.size > 0) {
      queryParams.category = Array.from(this.selectedCategories);
    }

    if (this.enableDuration) queryParams.maxDuration = this.maxDuration;
    if (this.enableDifficulty) queryParams.maxDifficulty = this.maxDifficulty;

    this.router.navigate(['/courses'], { queryParams });
    this.closeFilters();
  }

  resetFilters() {
    this.searchQuery = '';
    // Reset to the limits defined
    this.maxDuration = this.limitDuration;
    this.maxDifficulty = this.limitDifficulty;
    this.enableDuration = false;
    this.enableDifficulty = false;
    this.selectedCategories.clear();

    this.router.navigate(['/courses']);
    this.closeFilters();
  }
}