import { Given, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcrypt';
import type { CustomWorld } from '../../support/world.js';

Given(
  'que existe un cliente con id {int}',
  async function (this: CustomWorld, clienteId: number) {
    const id = Number(clienteId);

    // Si el usuario no existe en el repo, lo creamos
    if (!this.deps.usuariosRepository.buscarPorId(id)) {
      const passwordHash = await bcrypt.hash('Password123!', 12);
      this.deps.usuariosRepository.guardar({
        id: id,
        nombre: `Cliente ${id}`,
        email: `cliente${id}@test.com`,
        passwordHash,
        rol: 'CLIENTE'
      });
    }
    // Generamos el token usando el AuthService y lo guardamos
    const usuario = this.deps.usuariosRepository.buscarPorId(id)!;
    const { accessToken } = this.deps.authService.generarTokens(usuario);
    this.tokens[id] = accessToken;
  }
);

Given(
  'existe un producto con id {int}, nombre {string}, precio {int} y stock {int}',
  function (
    this: CustomWorld,
    id: number,
    nombre: string,
    precio: number,
    stock: number
  ) {
    this.deps.productosRepository.guardar({ id, nombre, precio, stock });
  }
);

Given(
  'el cliente {int} ya tiene el producto {int} con cantidad {int} en su carrito',
  function (
    this: CustomWorld,
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    this.deps.carritoService.agregarItem(clienteId, { productoId, cantidad });
  }
);

Then(
  'la respuesta debe tener codigo {int}',
  function (this: CustomWorld, status: number) {
    assert.equal(
      this.lastResponse.status,
      status,
      `Body recibido: ${JSON.stringify(this.lastResponse.body)}`
    );
  }
);

Then(
  'el carrito del cliente {int} debe contener el producto {int} con cantidad {int}',
  async function (
    this: CustomWorld,
    clienteId: number,
    productoId: number,
    cantidad: number
  ) {
    const response = await request(this.app)
      .get(`/api/v1/carrito/${clienteId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`);
    const item = response.body.data.items.find(
      (i: { productoId: number }) => i.productoId === productoId
    );
    assert.ok(item, `El producto ${productoId} no esta en el carrito`);
    assert.equal(item.cantidad, cantidad);
  }
);

Then(
  'el total del carrito del cliente {int} debe ser {int}',
  async function (this: CustomWorld, clienteId: number, total: number) {
    const response = await request(this.app)
      .get(`/api/v1/carrito/${clienteId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`);
    assert.equal(response.body.data.total, total);
  }
);

Then(
  'el cuerpo del error debe tener el codigo {string}',
  function (this: CustomWorld, code: string) {
    assert.equal(
      this.lastResponse.body?.error?.code,
      code,
      `Body recibido: ${JSON.stringify(this.lastResponse.body)}`
    );
  }
);

Then(
  'el carrito del cliente {int} no debe contener el producto {int}',
  async function (this: CustomWorld, clienteId: number, productoId: number) {
    const response = await request(this.app)
      .get(`/api/v1/carrito/${clienteId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`);
    const item = response.body.data.items.find(
      (i: { productoId: number }) => i.productoId === productoId
    );
    assert.equal(item, undefined);
  }
);

Then(
  'el carrito del cliente {int} debe estar vacio',
  async function (this: CustomWorld, clienteId: number) {
    const response = await request(this.app)
      .get(`/api/v1/carrito/${clienteId}`)
      .set('Authorization', `Bearer ${this.tokens[clienteId]}`);
    assert.equal(response.body.data.items.length, 0);
  }
);