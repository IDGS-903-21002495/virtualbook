import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AddBookComponent } from './add-book.component';
import { AuthService } from '../../services/auth.service';
import { LibrosService, BookResponse } from '../../services/libros.service';
import { ActivatedRoute } from '@angular/router';

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;

  const fakeUser = { id: 1 };

  const authSpy = {
    isAuthenticated: () => true,
    getUser: () => fakeUser
  } as Partial<AuthService>;

  const sampleBook: BookResponse = {
    id: 2,
    titulo: 'EMMA',
    autor: 'Jane Auten',
    genero: 'Romance',
    descripcion: 'Descripción de prueba',
    usuarioId: 1
  };

  const librosSpy = {
    addBook: jasmine.createSpy('addBook').and.returnValue(of(sampleBook)),
    getBookById: jasmine.createSpy('getBookById').and.returnValue(of(sampleBook)),
    updateBook: jasmine.createSpy('updateBook').and.returnValue(of(sampleBook))
  } as Partial<LibrosService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddBookComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: LibrosService, useValue: librosSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.bookForm.valid).toBeFalsy();
  });

  it('should validate titulo field', () => {
    const titulo = component.bookForm.get('titulo');
    expect(titulo?.valid).toBeFalsy();

    titulo?.setValue('Ab');
    expect(titulo?.valid).toBeFalsy();

    titulo?.setValue('Orgullo y prejuicio');
    expect(titulo?.valid).toBeTruthy();
  });

  it('should call updateBook when route has id and form is valid', async () => {
    // Reset spies
    (librosSpy.getBookById as jasmine.Spy).calls.reset();
    (librosSpy.updateBook as jasmine.Spy).calls.reset();

    // Reconfigure TestBed with route param '2'
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        AddBookComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: LibrosService, useValue: librosSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (k: string) => k === 'id' ? '2' : null } } } }
      ]
    }).compileComponents();

    // Create new component instance with the updated route
    const editFixture = TestBed.createComponent(AddBookComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    // Ensure form is populated from getBookById (spy returns sampleBook)
    expect(librosSpy.getBookById).toHaveBeenCalledWith(fakeUser.id, 2);
    expect(editComponent.bookForm.get('titulo')?.value).toBe('EMMA');

    // Modify form (simulate user edit)
    editComponent.bookForm.get('titulo')?.setValue('EMMA EDITADA');

    // Submit
    editComponent.onSubmit();

    expect(librosSpy.updateBook).toHaveBeenCalled();
    const calledArgs = (librosSpy.updateBook as jasmine.Spy).calls.mostRecent().args;
    expect(calledArgs[0]).toBe(fakeUser.id);
    expect(calledArgs[1]).toBe(2);
    expect(calledArgs[2].titulo).toBe('EMMA EDITADA');
  });
});
