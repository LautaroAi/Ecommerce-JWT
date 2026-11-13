import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/swagger/swagger-spec.js';
import { ProductosRepository } from './productos/productos.repository.js';
import { CarritoRepository } from './carrito/carrito.repository.js';
import { CarritoService } from './carrito/carrito.service.js';
import { crearCarritoRouter } from './carrito/carrito.routes.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';

export type AppDependencies = {
  productosRepository: ProductosRepository;
  carritoRepository: CarritoRepository;
  carritoService: CarritoService;
};

export function buildDependencies(): AppDependencies {
  const productosRepository = new ProductosRepository();
  const carritoRepository = new CarritoRepository();
  const carritoService = new CarritoService(
    carritoRepository,
    productosRepository
  );
  return { productosRepository, carritoRepository, carritoService };
}

export function createApp(deps: AppDependencies): Express {
  const app = express();
  app.use(express.json());

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.use('/api/v1/carrito', crearCarritoRouter(deps.carritoService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}