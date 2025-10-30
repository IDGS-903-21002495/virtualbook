import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, RegisterRequest, LoginRequest } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const registerData: RegisterRequest = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'Password123@'
    };

    const mockResponse = {
      id: 5,
      nombre: 'Juan Pérez',
      email: 'juan@example.com'
    };

    service.register(registerData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://virtualbook-backend.onrender.com/api/usuarios/registro');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user', () => {
    const loginData: LoginRequest = {
      email: 'juan@example.com',
      password: 'Password123@'
    };

    const mockResponse = {
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: 5,
        nombre: 'Juan Pérez',
        email: 'juan@example.com'
      }
    };

    service.login(loginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://virtualbook-backend.onrender.com/api/usuarios/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should save and retrieve user data', () => {
    const usuario = {
      id: 5,
      nombre: 'Juan Pérez',
      email: 'juan@example.com'
    };

    service.saveUser(usuario);
    const retrievedUser = service.getUser();
    expect(retrievedUser).toEqual(usuario);
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalse();

    const usuario = {
      id: 5,
      nombre: 'Juan Pérez',
      email: 'juan@example.com'
    };
    service.saveUser(usuario);

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should logout user', () => {
    const usuario = {
      id: 5,
      nombre: 'Juan Pérez',
      email: 'juan@example.com'
    };
    service.saveUser(usuario);
    expect(service.isAuthenticated()).toBeTrue();

    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
