import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcrypt';
import type { CustomWorld } from '../support/world.js';
import type { Rol } from '../../src/usuarios/usuarios.types.js';

// ---------- GIVEN ----------

Given('que ya existe un usuario con email {string}', async function (this: CustomWorld, email: string) {
  await this.deps.usuariosService.registrar({
    nombre: 'Usuario Test',
    email,
    password: 'Password123!'
  });
});

Given('que existe un usuario registrado con email {string} y password {string}', async function (this: CustomWorld, email: string, password: string) {
  await this.deps.usuariosService.registrar({
    nombre: 'Usuario Test',
    email,
    password
  });
});

Given('que existe un usuario registrado con rol {string} y email {string}', async function (this: CustomWorld, rol: string, email: string) {
  // Usamos el repositorio directo para forzar el rol (ej. ADMIN) en pruebas
  const passwordHash = await bcrypt.hash('Password123!', 12);
  this.deps.usuariosRepository.guardar({
    id: this.deps.usuariosRepository.siguienteId(),
    nombre: `Usuario ${rol}`,
    email,
    passwordHash,
    rol: rol as Rol
  });
});

Given('inicio sesion como {string}', async function (this: CustomWorld, email: string) {
  // Hacemos un login real para obtener el JWT y guardarlo en el World
  const response = await request(this.app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password123!' });
    
  assert.equal(response.status, 200, 'Fallo el login en el Background');
  this.authToken = response.body.accessToken; 
});

// ---------- WHEN ----------

When('me registro con nombre {string}, email {string} y password {string}', async function (this: CustomWorld, nombre: string, email: string, password: string) {
  this.lastResponse = await request(this.app)
    .post('/api/v1/auth/register')
    .send({ nombre, email, password });
});

When('inicio sesion con email {string} y password {string}', async function (this: CustomWorld, email: string, password: string) {
  this.lastResponse = await request(this.app)
    .post('/api/v1/auth/login')
    .send({ email, password });
});

When('intento ver el carrito del cliente {int} sin token', async function (this: CustomWorld, clienteId: number) {
  this.lastResponse = await request(this.app)
    .get(`/api/v1/carrito/${clienteId}`); // Petición sin Authorization
});

When('intento acceder a la ruta de administrador', async function (this: CustomWorld) {
  this.lastResponse = await request(this.app)
    .get('/api/v1/admin/dashboard')
    .set('Authorization', `Bearer ${this.authToken}`); // Usa el token del World
});

When('intento ver el carrito del cliente {int}', async function (this: CustomWorld, clienteId: number) {
  this.lastResponse = await request(this.app)
    .get(`/api/v1/carrito/${clienteId}`)
    .set('Authorization', `Bearer ${this.authToken}`); // Usa el token del World
});

// ---------- THEN ----------

Then('el cuerpo debe contener un mensaje de exito', function (this: CustomWorld) {
  assert.ok(this.lastResponse.body.mensaje, 'No se encontró el mensaje de exito');
  assert.equal(this.lastResponse.body.mensaje, 'Usuario registrado exitosamente');
});

Then('el cuerpo debe contener un accessToken y un refreshToken', function (this: CustomWorld) {
  assert.ok(this.lastResponse.body.accessToken, 'Falta el accessToken');
  assert.ok(this.lastResponse.body.refreshToken, 'Falta el refreshToken');
});