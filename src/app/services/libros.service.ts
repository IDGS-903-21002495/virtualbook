import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookRequest {
  titulo: string;
  autor: string;
  genero: string;
  descripcion: string;
}

export interface BookResponse {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  descripcion: string;
  usuarioId: number;
  usuario?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private http = inject(HttpClient);
  private baseUrl = 'https://virtualbook-backend.onrender.com/api/Libros';

  addBook(userId: number, bookData: BookRequest): Observable<BookResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}/${userId}/libro`;
    return this.http.post<BookResponse>(url, bookData, { headers });
  }

  getBooksByUser(userId: number): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(`${this.baseUrl}/${userId}`);
  }

  getBookById(userId: number, bookId: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.baseUrl}/${userId}/libro/${bookId}`);
  }

  updateBook(userId: number, bookId: number, bookData: BookRequest): Observable<BookResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<BookResponse>(
      `${this.baseUrl}/${userId}/libro/${bookId}`,
      bookData,
      { headers }
    );
  }

  deleteBook(userId: number, bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${bookId}`);
  }
}
