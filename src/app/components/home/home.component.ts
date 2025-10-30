import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
//Componente Home que gestiona la vista principal después del login
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Usuario';
  userEmail: string = '';

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener datos del usuario
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userEmail = user.email;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAddBook(): void {
    this.router.navigate(['/add-book']);
  }

  goToMyBooks(): void {
    this.router.navigate(['/books']);
  }
}
