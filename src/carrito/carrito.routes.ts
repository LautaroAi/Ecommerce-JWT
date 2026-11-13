import { Router } from 'express';
import type { CarritoService } from './carrito.service.js';
import { CarritoController } from './carrito.controller.js';
import { requireAuth, checkOwnership } from '../shared/middlewares/auth.middleware.js';

export function crearCarritoRouter(service: CarritoService): Router {
  const router = Router();
  const controller = new CarritoController(service);

  // 1. requireAuth se aplica a TODAS las rutas del carrito
  router.use(requireAuth);

  // 2. checkOwnership se aplica en cada ruta. Como está a nivel de ruta,
  // Express ya parseó :clienteId y está disponible en req.params.
  router.get('/:clienteId', checkOwnership, controller.obtener);
  router.post('/:clienteId/items', checkOwnership, controller.agregarItem);
  router.patch('/:clienteId/items/:productoId', checkOwnership, controller.modificarCantidad);
  router.delete('/:clienteId/items/:productoId', checkOwnership, controller.eliminarItem);

  return router;
}