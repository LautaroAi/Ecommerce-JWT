import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../shared/errors/app-error.js';
import type { UsuariosService } from '../usuarios/usuarios.service.js';
import type { AuthService } from './auth.service.js';

// Esquemas de validación estricta con Zod
const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').trim(),
  email: z.string().email('El formato del email es inválido').toLowerCase(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
}).strict();

const loginSchema = z.object({
  email: z.string().email('El formato del email es inválido').toLowerCase(),
  password: z.string().min(1, 'La contraseña es requerida')
}).strict();

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'El refresh token es requerido')
}).strict();

export class AuthController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly authService: AuthService
  ) {}

  registrar = async (request: Request, response: Response): Promise<void> => {
    try {
      const dto = registerSchema.parse(request.body);
      await this.usuariosService.registrar(dto);
      
      response.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
      this.manejarErrorZod(error);
    }
  };

  login = async (request: Request, response: Response): Promise<void> => {
    try {
      const dto = loginSchema.parse(request.body);
      const tokens = await this.authService.login(dto.email, dto.password);
      
      response.status(200).json(tokens);
    } catch (error) {
      this.manejarErrorZod(error);
    }
  };

  refresh = async (request: Request, response: Response): Promise<void> => {
    try {
      const dto = refreshSchema.parse(request.body);
      const tokens = this.authService.refresh(dto.refreshToken);
      
      response.status(200).json(tokens);
    } catch (error) {
      this.manejarErrorZod(error);
    }
  };

  // Helper para transformar errores de Zod en AppError uniformes
  private manejarErrorZod(error: unknown): never {
    if (error instanceof ZodError) {
      // Usar 'issues' en lugar de 'errors'
      const detalles = error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensaje: issue.message
      }));
      
      throw new AppError(422, 'INVALID_DATA', 'Datos de entrada inválidos', detalles);
    }
    
    // Si es un AppError (ej. EMAIL_EXISTS lanzado por el service), lo deja pasar
    throw error; 
  }
}