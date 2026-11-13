import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import type { CustomWorld } from '../support/world.js';

Given('que ya existe un usuario con email {string}', function (this: CustomWorld, email: string) {
  throw new Error('RED: Implementar en GREEN');
});

When('me registro con nombre {string}, email {string} y password {string}', async function (this: CustomWorld, nombre: string, email: string, password: string) {
  throw new Error('RED: Implementar en GREEN');
});

Given('que existe un usuario registrado con email {string} y password {string}', function (this: CustomWorld, email: string, password: string) {
  throw new Error('RED: Implementar en GREEN');
});

When('inicio sesion con email {string} y password {string}', async function (this: CustomWorld, email: string, password: string) {
  throw new Error('RED: Implementar en GREEN');
});

Given('que existe un usuario registrado con rol {string} y email {string}', function (this: CustomWorld, rol: string, email: string) {
  throw new Error('RED: Implementar en GREEN');
});

Given('inicio sesion como {string}', async function (this: CustomWorld, email: string) {
  throw new Error('RED: Implementar en GREEN');
});

When('intento ver el carrito del cliente {int} sin token', async function (this: CustomWorld, clienteId: number) {
  throw new Error('RED: Implementar en GREEN');
});

When('intento acceder a la ruta de administrador', async function (this: CustomWorld) {
  throw new Error('RED: Implementar en GREEN');
});

When('intento ver el carrito del cliente {int}', async function (this: CustomWorld, clienteId: number) {
  throw new Error('RED: Implementar en GREEN');
});

Then('el cuerpo debe contener un mensaje de exito', function (this: CustomWorld) {
  assert.ok(this.lastResponse.body.mensaje);
});

Then('el cuerpo debe contener un accessToken y un refreshToken', function (this: CustomWorld) {
  assert.ok(this.lastResponse.body.accessToken);
  assert.ok(this.lastResponse.body.refreshToken);
});