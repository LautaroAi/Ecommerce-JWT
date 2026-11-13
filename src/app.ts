import express, { type Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

// Swagger
import { swaggerSpec } from './shared/swagger/swagger-spec.js';

// Logger
import { logger } from './shared/logger.js';

// Repositorios y Servicios
import { ProductosRepository } from './productos/productos.repository.js';
import { CarritoRepository } from './carrito/carrito.repository.js';
import { CarritoService } from './carrito/carrito.service.js';
import { UsuariosRepository } from './usuarios/usuarios.repository.js';
import { UsuariosService } from './usuarios/usuarios.service.js';
import { AuthService } from './auth/auth.service.js';
import { AuthController } from './auth/auth.controller.js';

// Rutas
import { crearCarritoRouter } from './carrito/carrito.routes.js';
import { crearAuthRouter } from './auth/auth.routes.js';

// Middlewares de Seguridad y Errores
import { requireAuth, requireRole } from './shared/middlewares/auth.middleware.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';

export type AppDependencies = {
  productosRepository: ProductosRepository;
  carritoRepository: CarritoRepository;
  carritoService: CarritoService;
  usuariosRepository: UsuariosRepository;
  usuariosService: UsuariosService;
  authService: AuthService;
  authController: AuthController;
};

export function buildDependencies(): AppDependencies {
  // 1. Repositorios en memoria
  const productosRepository = new ProductosRepository();
  const carritoRepository = new CarritoRepository();
  const usuariosRepository = new UsuariosRepository();

  // 2. Servicios
  const carritoService = new CarritoService(carritoRepository, productosRepository);
  const usuariosService = new UsuariosService(usuariosRepository);
  const authService = new AuthService(usuariosService);

  // 3. Controladores
  const authController = new AuthController(usuariosService, authService);

  return {
    productosRepository,
    carritoRepository,
    carritoService,
    usuariosRepository,
    usuariosService,
    authService,
    authController
  };
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  // Rate Limiter dentro de createApp para aislar el estado en los tests
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 intentos
    message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos de login' } }
  });

  // --- 1. Hardening y Middlewares Globales ---
  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());

  // Logger de peticiones (Pino)
  app.use((req, _res, next) => {
    logger.info({ req: { method: req.method, url: req.url } }, 'Peticion recibida');
    next();
  });

  // --- 2. Documentación (Pública) ---
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // --- 3. Autenticación (Pública + Rate Limit en Login) ---
  app.use('/api/v1/auth/login', loginLimiter);
  app.use('/api/v1/auth', crearAuthRouter(deps.authController));

  // --- 4. Ruta de prueba para RBAC (ADMIN) ---
  app.get(
    '/api/v1/admin/dashboard',
    requireAuth,
    requireRole(['ADMIN']),
    (_req, res) => {
      res.json({ mensaje: 'Bienvenido al panel de administrador' });
    }
  );

  // --- 5. Rutas Protegidas (Carrito) ---
  app.use('/api/v1/carrito', crearCarritoRouter(deps.carritoService));

  // --- 6. Manejo de Errores ---
  app.use(notFound);
  app.use(errorHandler);

  return app;
}