import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate nombre field', () => {
    const nombre = component.registerForm.get('nombre');
    expect(nombre?.valid).toBeFalsy();
    
    nombre?.setValue('Ab');
    expect(nombre?.valid).toBeFalsy();
    
    nombre?.setValue('Juan Pérez');
    expect(nombre?.valid).toBeTruthy();
  });

  it('should validate email field', () => {
    const email = component.registerForm.get('email');
    expect(email?.valid).toBeFalsy();
    
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();
    
    email?.setValue('valid@email.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    const password = component.registerForm.get('password');
    const confirmPassword = component.registerForm.get('confirmPassword');
    
    password?.setValue('Password123@');
    confirmPassword?.setValue('DifferentPass123@');
    
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTruthy();
    
    confirmPassword?.setValue('Password123@');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeFalsy();
  });
});
