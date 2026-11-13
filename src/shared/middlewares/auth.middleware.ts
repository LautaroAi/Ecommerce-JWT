import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

// Extendemos la interfaz Request para incluir la propiedad 'usuario'
export interface AuthRequest extends Request {
  usuario?: { id: number; rol: string };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Token no proporcionado'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: number; rol: string };
    req.usuario = payload;
    next();
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Token inválido o expirado'));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return next(new AppError(403, 'FORBIDDEN', 'No tienes permisos suficientes'));
    }
    next();
  };
};

// Prevención de IDOR
export const checkOwnership = (req: AuthRequest, _res: Response, next: NextFunction) => {
  // Forzamos a Number() para evitar el bug de 'string !== number' en req.params
  const clienteIdParam = Number(req.params.clienteId);
  const usuarioId = Number(req.usuario?.id);

  // Si es ADMIN, tiene permiso total (RBAC)
  if (req.usuario?.rol === 'ADMIN') return next();

  // Si es CLIENTE, solo puede acceder a su propio ID
  if (usuarioId !== clienteIdParam) {
    return next(new AppError(403, 'FORBIDDEN', 'No puedes acceder al carrito de otro cliente'));
  }
  
  next();
};