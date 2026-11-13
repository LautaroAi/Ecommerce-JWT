import { When } from '@cucumber/cucumber';
import request from 'supertest';
import type { CustomWorld } from '../../support/world.js';

When(
  'el cliente {int} agrega el producto {int} con cantidad {int} a su carrito',
  async function (
    this: CustomWorld,
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    this.lastResponse = await request(this.app)
      .post(`/api/v1/carrito/${clienteId}/items`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`)
      .send({ productoId, cantidad });
  }
);