import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  protected title = 'virtualbook';
  isAuthenticated = false;

  ngOnInit(): void {
    // Verificar autenticación inicial
    this.checkAuth();

    // Escuchar cambios de ruta para actualizar estado
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuth();
      });
  }

  private checkAuth(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  public throwTestError(): void {
    throw new Error('This is a test error for Sentry!');
  }
}
