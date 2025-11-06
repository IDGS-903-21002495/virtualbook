import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LibrosService, BookRequest, BookResponse } from '../../services/libros.service';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private librosService = inject(LibrosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  userId: number = 0;
  // Edit mode
  isEditMode: boolean = false;
  editingBookId: number | null = null;

  constructor() {
    this.bookForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Verificar autenticación y obtener usuario
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getUser();
    if (user) {
      this.userId = user.id;
    }

    // Revisar si viene un id en la ruta para modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const bookId = Number(idParam);
      if (!isNaN(bookId)) {
        this.isEditMode = true;
        this.editingBookId = bookId;
        this.loadBookForEdit(bookId);
      }
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const bookData: BookRequest = {
        titulo: this.bookForm.value.titulo,
        autor: this.bookForm.value.autor,
        genero: this.bookForm.value.genero,
        descripcion: this.bookForm.value.descripcion
      };

      if (this.isEditMode && this.editingBookId != null) {
        // Modo edición
        this.librosService.updateBook(this.userId, this.editingBookId, bookData).subscribe({
          next: (response: BookResponse) => {
            this.isLoading = false;
            this.successMessage = '¡Libro actualizado exitosamente!';
            console.log('Libro actualizado:', response);
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
          error: (error: unknown) => {
            this.isLoading = false;
            this.errorMessage = (error as any).error?.mensaje || (error as any).error?.message || 'Error al actualizar el libro. Por favor, intenta nuevamente.';
            console.error('Error al actualizar libro:', error);
          }
        });
      } else {
        // Modo agregar
        this.librosService.addBook(this.userId, bookData).subscribe({
          next: (response: BookResponse) => {
            this.isLoading = false;
            this.successMessage = '¡Libro agregado exitosamente!';
            console.log('Libro agregado:', response);
            
            // Limpiar formulario
            this.bookForm.reset();
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          },
          error: (error: unknown) => {
            this.isLoading = false;
            this.errorMessage = (error as any).error?.mensaje || (error as any).error?.message || 'Error al agregar el libro. Por favor, intenta nuevamente.';
            console.error('Error al agregar libro:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.bookForm);
    }
  }

  private loadBookForEdit(bookId: number): void {
    this.isLoading = true;
    this.librosService.getBookById(this.userId, bookId).subscribe({
      next: (book: BookResponse) => {
        this.isLoading = false;
        this.bookForm.patchValue({
          titulo: book.titulo,
          autor: book.autor,
          genero: book.genero,
          descripcion: book.descripcion
        });
      },
      error: (err: unknown) => {
        this.isLoading = false;
        console.error('Error al cargar libro para edición:', err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  get titulo() {
    return this.bookForm.get('titulo');
  }

  get autor() {
    return this.bookForm.get('autor');
  }

  get genero() {
    return this.bookForm.get('genero');
  }

  get descripcion() {
    return this.bookForm.get('descripcion');
  }
}
