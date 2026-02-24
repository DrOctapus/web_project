import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Data Signals
  allBooks = signal<any[]>([]);
  allCourses = signal<any[]>([]);
  
  // UI State
  isFilterMenuOpen = signal(false);

  stagedSearchQuery = signal('');
  stagedOnlyAvailable = signal(false);
  stagedEnableYearFilter = signal(false);
  stagedYear = signal(2025);
  stagedPublishers = signal<Set<string>>(new Set());
  stagedCourses = signal<Set<string>>(new Set());

  activeSearchQuery = signal('');
  activeOnlyAvailable = signal(false);
  activeEnableYearFilter = signal(false);
  activeYear = signal(2025);
  activePublishers = signal<Set<string>>(new Set());
  activeCourses = signal<Set<string>>(new Set());

  // Dynamic Filter Options
  uniquePublishers = computed(() => {
    const pubs = new Set(this.allBooks().map(b => b.publisher));
    return Array.from(pubs).sort();
  });

  // Dynamic Min/Max Years
  minYearAvailable = computed(() => {
    const years = this.allBooks().map(b => b.publicationYear);
    return years.length ? Math.min(...years) : 1900;
  });

  maxYearAvailable = computed(() => {
    const years = this.allBooks().map(b => b.publicationYear);
    return years.length ? Math.max(...years) : new Date().getFullYear();
  });

  filteredBooks = computed(() => {
    let books = this.allBooks();
    const search = this.activeSearchQuery().toLowerCase();

    // Search
    if (search) {
      books = books.filter(b => 
        b.title.toLowerCase().includes(search) || 
        b.description.toLowerCase().includes(search) || 
        b.publisher.toLowerCase().includes(search)
      );
    }

    // Availability
    if (this.activeOnlyAvailable()) {
      books = books.filter(b => b.stock > 0);
    }

    // Year Limit
    if (this.activeEnableYearFilter()) {
      books = books.filter(b => b.publicationYear <= this.activeYear());
    }

    // Publishers
    if (this.activePublishers().size > 0) {
      books = books.filter(b => this.activePublishers().has(b.publisher));
    }

    // Courses
    if (this.activeCourses().size > 0) {
      books = books.filter(b => 
        b.course?.some((c: any) => this.activeCourses().has(typeof c === 'string' ? c : c._id))
      );
    }

    return books;
  });

  ngOnInit() {
    this.loadData();

    this.route.queryParams.subscribe(params => {
      // Text Search
      const qTitle = params['title'] || '';
      this.activeSearchQuery.set(qTitle);
      this.stagedSearchQuery.set(qTitle);

      // Availability
      const qStock = params['inStock'] === 'true';
      this.activeOnlyAvailable.set(qStock);
      this.stagedOnlyAvailable.set(qStock);

      // Year Filter
      if (params['maxYear']) {
        const y = Number(params['maxYear']);
        this.activeYear.set(y);
        this.stagedYear.set(y);
        this.activeEnableYearFilter.set(true);
        this.stagedEnableYearFilter.set(true);
      } else {
        this.activeEnableYearFilter.set(false);
        this.stagedEnableYearFilter.set(false);
      }

      // Publishers
      const pubs = params['publisher'];
      const pubSet = new Set<string>();
      if (pubs) {
        const arr = Array.isArray(pubs) ? pubs : [pubs];
        arr.forEach((p: string) => pubSet.add(p));
      }
      this.activePublishers.set(pubSet);
      this.stagedPublishers.set(new Set(pubSet)); // Copy to Staged

      // Courses
      const courses = params['course'];
      const courseSet = new Set<string>();
      if (courses) {
        const arr = Array.isArray(courses) ? courses : [courses];
        arr.forEach((c: string) => courseSet.add(c));
      }
      this.activeCourses.set(courseSet);
      this.stagedCourses.set(new Set(courseSet)); // Copy to Staged
    });
  }

  loadData() {
    this.apiService.getBooks().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.allBooks.set(res.data);
          
          // Initialize sliders if not active
          if (!this.activeEnableYearFilter()) {
             const max = this.maxYearAvailable();
             this.stagedYear.set(max);
             this.activeYear.set(max);
          }
        }
      },
      error: (err) => console.error('Error loading books:', err)
    });

    this.apiService.getCourses().subscribe({
      next: (res: any) => {
        if (res.success) this.allCourses.set(res.data);
      }
    });
  }

  // UI Handlers

  toggleFilters() {
    const newState = !this.isFilterMenuOpen();
    this.isFilterMenuOpen.set(newState);
    
    if (newState) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  closeFilters() {
    this.isFilterMenuOpen.set(false);
    document.body.classList.remove('no-scroll');
  }

  // Updates staged
  togglePublisher(pub: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.stagedPublishers.update(set => {
      const newSet = new Set(set);
      checked ? newSet.add(pub) : newSet.delete(pub);
      return newSet;
    });
  }

  toggleCourse(courseId: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.stagedCourses.update(set => {
      const newSet = new Set(set);
      checked ? newSet.add(courseId) : newSet.delete(courseId);
      return newSet;
    });
  }

  // Pushes staged to URL
  applyFilters() {
    const queryParams: any = {};

    if (this.stagedSearchQuery()) queryParams.title = this.stagedSearchQuery();
    if (this.stagedOnlyAvailable()) queryParams.inStock = 'true';
    if (this.stagedEnableYearFilter()) queryParams.maxYear = this.stagedYear();
    
    if (this.stagedPublishers().size > 0) {
      queryParams.publisher = Array.from(this.stagedPublishers());
    }
    
    if (this.stagedCourses().size > 0) {
      queryParams.course = Array.from(this.stagedCourses());
    }

    this.router.navigate(['/books'], { queryParams });
    this.closeFilters();
  }

  resetFilters() {
    this.router.navigate(['/books']);
    
    this.stagedEnableYearFilter.set(false);
    this.stagedYear.set(this.maxYearAvailable());
    
    this.closeFilters();
  }
}