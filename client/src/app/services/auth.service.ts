import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  currentUser = signal<any>(null);

  constructor() {
    const saved = localStorage.getItem('bb_user');
    if (saved) {
      this.currentUser.set(JSON.parse(saved));
    }
  }

  login(credentials: any) {
    return this.api.login(credentials).pipe(
      tap((res: any) => {
        if (res.success) {
          this.setCurrentUser(res.data);
        }
      })
    );
  }

  register(data: any) {
    return this.api.register(data).pipe(
      tap((res: any) => {
        if (res.success) {
          this.setCurrentUser(res.data);
        }
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('bb_user');
    this.router.navigate(['/']);
  }

  private setCurrentUser(user: any) {
    console.log(user)
    this.currentUser.set(user);
    localStorage.setItem('bb_user', JSON.stringify(user));
  }
}