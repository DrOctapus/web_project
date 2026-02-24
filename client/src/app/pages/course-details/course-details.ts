import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.html',
  styleUrl: './course-details.css',
})
export class CourseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  course = signal<any>(null);

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id'); 
  
  if (id) {
    this.apiService.getCourseById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.course.set(res.data);
        }
      },
      error: (err) => console.error('Error fetching course details:', err)
    });
  } else {
    console.error('No ID found in URL route parameters');
  }
}

  getDifficultyColor(level: number): string {
    if (level === 1) return "#28a745";
    if (level === 2) return "#fd7e14";
    return "#dc3545";
  }

  getDifficultyLabel(level: number): string {
    const map: { [key: number]: string } = { 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
    return map[level] || "Unknown";
  }

  getCategoryName(course: any): string {
    return course?.category?.name || 'Uncategorized';
  }
}