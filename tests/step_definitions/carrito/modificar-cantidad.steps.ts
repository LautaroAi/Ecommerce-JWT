import { When } from '@cucumber/cucumber';
import request from 'supertest';
import type { CustomWorld } from '../../support/world.js';

When(
  'el cliente {int} modifica la cantidad del producto {int} a {int}',
  async function (
    this: CustomWorld,
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    this.lastResponse = await request(this.app)
      .patch(`/api/v1/carrito/${clienteId}/items/${productoId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`)
      .send({ cantidad });
  }
);