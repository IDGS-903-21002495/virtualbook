import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AddBookComponent } from './add-book.component';

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddBookComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

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

  it('should validate autor field', () => {
    const autor = component.bookForm.get('autor');
    expect(autor?.valid).toBeFalsy();
    
    autor?.setValue('Ab');
    expect(autor?.valid).toBeFalsy();
    
    autor?.setValue('Jane Austen');
    expect(autor?.valid).toBeTruthy();
  });

  it('should validate descripcion field', () => {
    const descripcion = component.bookForm.get('descripcion');
    expect(descripcion?.valid).toBeFalsy();
    
    descripcion?.setValue('Corto');
    expect(descripcion?.valid).toBeFalsy();
    
    descripcion?.setValue('Una descripción larga del libro');
    expect(descripcion?.valid).toBeTruthy();
  });
});
