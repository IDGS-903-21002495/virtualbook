import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LibrosService, BookResponse } from '../../services/libros.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {
  private authService = inject(AuthService);
  private librosService = inject(LibrosService);
  private router = inject(Router);

  books: BookResponse[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  userId: number = 0;

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getUser();
    if (user) {
      this.userId = user.id;
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.librosService.getBooksByUser(this.userId).subscribe({
      next: (response: BookResponse[]) => {
        this.books = response;
        this.isLoading = false;
        console.log('Libros cargados:', response);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar los libros. Por favor, intenta nuevamente.';
        console.error('Error al cargar libros:', error);
      }
    });
  }

  goToAddBook(): void {
    this.router.navigate(['/add-book']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  deleteBook(book: BookResponse): void {
    if (confirm(`¿Estás seguro de que deseas eliminar "${book.titulo}"?`)) {
      this.librosService.deleteBook(this.userId, book.id).subscribe({
        next: () => {
          console.log('Libro eliminado exitosamente');
          // Recargar la lista de libros después de eliminar
          this.loadBooks();
        },
        error: (error: any) => {
          console.error('Error al eliminar el libro:', error);
          alert('Error al eliminar el libro. Por favor, intenta nuevamente.');
        }
      });
    }
  }
}
