import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  authService = inject(AuthService);
  // sidenavbar toggler
  isMenuOpen = signal(false);

  toggleMenu() {
    const newState = !this.isMenuOpen();
    this.isMenuOpen.set(newState);

    if (newState) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }
  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.classList.remove("no-scroll");
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}
