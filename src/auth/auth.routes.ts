import { Router } from 'express';
import type { AuthController } from './auth.controller.js';

export function crearAuthRouter(controller: AuthController): Router {
  const router = Router();

  // POST /api/v1/auth/register
  router.post('/register', controller.registrar);

  // POST /api/v1/auth/login
  // (El rate limiter ya se aplica en app.ts antes de llegar acá)
  router.post('/login', controller.login);

  // POST /api/v1/auth/refresh
  router.post('/refresh', controller.refresh);

  return router;
}