import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LibrosService, BookRequest } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LibrosService]
    });
    service = TestBed.inject(LibrosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a book', () => {
    const userId = 1;
    const bookData: BookRequest = {
      titulo: 'Orgullo y prejuicio',
      autor: 'Jane Austen',
      genero: 'Romance',
      descripcion: 'Una novela clásica'
    };

    const mockResponse = {
      id: 3,
      titulo: 'Orgullo y prejuicio',
      autor: 'Jane Austen',
      genero: 'Romance',
      descripcion: 'Una novela clásica',
      usuarioId: 1
    };

    service.addBook(userId, bookData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://virtualbook-backend.onrender.com/api/libros/usuario/1/libro');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get books by user', () => {
    const userId = 1;
    const mockBooks = [
      {
        id: 1,
        titulo: 'Libro 1',
        autor: 'Autor 1',
        genero: 'Ficción',
        descripcion: 'Descripción 1',
        usuarioId: 1
      }
    ];

    service.getBooksByUser(userId).subscribe(books => {
      expect(books).toEqual(mockBooks);
    });

    const req = httpMock.expectOne(`https://virtualbook-backend.onrender.com/api/libros/usuario/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBooks);
  });

  it('should delete a book', () => {
    const userId = 1;
    const bookId = 2;
    const mockResponse = { mensaje: 'El libro ha sido eliminado correctamente.' };

    service.deleteBook(userId, bookId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://virtualbook-backend.onrender.com/api/libros/usuario/${userId}/libro/${bookId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
