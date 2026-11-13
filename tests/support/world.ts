import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import type { Express } from 'express';
import type { Response } from 'supertest';
import { buildDependencies, createApp, type AppDependencies } from '../../src/app.js';

export class CustomWorld extends World {
  deps: AppDependencies;
  app: Express;
  lastResponse!: Response;
  tokens: Record<number, string> = {}; // Almacena tokens por ID de cliente (Carrito)
  authToken?: string;                  // Almacena el token de sesión (Auth)

  constructor(options: IWorldOptions) {
    super(options);
    this.deps = buildDependencies();
    this.app = createApp(this.deps);
  }
}

setWorldConstructor(CustomWorld);