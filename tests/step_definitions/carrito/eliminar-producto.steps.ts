import { Given, When } from '@cucumber/cucumber';
import request from 'supertest';
import type { CustomWorld } from '../../support/world.js';

Given(
  'el cliente {int} elimino el producto {int} de su carrito',
  function (this: CustomWorld, clienteId: number, productoId: number) {
    this.deps.carritoService.eliminarItem(clienteId, productoId);
  }
);

When(
  'el cliente {int} elimina el producto {int} de su carrito',
  async function (this: CustomWorld, clienteId: number, productoId: number) {
    this.lastResponse = await request(this.app)
      .delete(`/api/v1/carrito/${clienteId}/items/${productoId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`);
  }
);