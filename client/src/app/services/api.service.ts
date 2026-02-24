import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  // Users / Auth
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/check-email`, { email });
  }

  // Courses
  getCourses(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.append(key, filters[key]);
      });
    }
    return this.http.get(`${this.apiUrl}/courses`, { params });
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  // Books
  getBooks(limit?: number): Observable<any> {
    let params = new HttpParams();
    if (limit) params = params.append('limit', limit);
    return this.http.get(`${this.apiUrl}/books`, { params });
  }
}