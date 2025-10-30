import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  nombre: string;
  email: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://virtualbook-backend.onrender.com/api/usuarios/login';
  private registerUrl = 'https://virtualbook-backend.onrender.com/api/usuarios/registro';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(this.apiUrl, credentials, { headers });
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RegisterResponse>(this.registerUrl, userData, { headers });
  }

  saveUser(usuario: Usuario): void {
    localStorage.setItem('user_data', JSON.stringify(usuario));
  }

  getUser(): Usuario | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    localStorage.removeItem('user_data');
  }
}
