import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BooksListComponent } from './books-list.component';
import { LibrosService } from '../../services/libros.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let librosService: LibrosService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    librosService = TestBed.inject(LibrosService);
    authService = TestBed.inject(AuthService);
    
    // Mock del usuario autenticado
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    spyOn(authService, 'getUser').and.returnValue({ id: 1, nombre: 'Test User', email: 'test@test.com' });
    spyOn(librosService, 'getBooksByUser').and.returnValue(of([]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteBook and reload books on confirmation', () => {
    const mockBook = {
      id: 1,
      titulo: 'Test Book',
      autor: 'Test Author',
      genero: 'Test Genre',
      descripcion: 'Test Description',
      usuarioId: 1
    };

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(librosService, 'deleteBook').and.returnValue(of({ mensaje: 'Libro eliminado' }));
    spyOn(component, 'loadBooks');

    component.deleteBook(mockBook);

    expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar "Test Book"?');
    expect(librosService.deleteBook).toHaveBeenCalledWith(1, 1);
    expect(component.loadBooks).toHaveBeenCalled();
  });

  it('should not delete book if user cancels confirmation', () => {
    const mockBook = {
      id: 1,
      titulo: 'Test Book',
      autor: 'Test Author',
      genero: 'Test Genre',
      descripcion: 'Test Description',
      usuarioId: 1
    };

    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(librosService, 'deleteBook');

    component.deleteBook(mockBook);

    expect(window.confirm).toHaveBeenCalled();
    expect(librosService.deleteBook).not.toHaveBeenCalled();
  });
});
