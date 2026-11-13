export const swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'XP-Commerce API',
    version: '1.0.0',
    description: 'API REST para el e-commerce (Carrito, Auth y Seguridad)'
  },
  servers: [
    { url: 'http://localhost:3000/api/v1', description: 'Servidor local' }
  ],
  paths: {
    // --- AUTH ---
    '/auth/register': {
      post: {
        summary: 'Registro de usuarios',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre: { type: 'string', example: 'Lauti' },
                  email: { type: 'string', example: 'lauti@test.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Usuario registrado exitosamente' },
          '400': { description: 'Email ya registrado' },
          '422': { description: 'Datos de entrada inválidos (Zod)' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Inicio de sesión (JWT)',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'lauti@test.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Login exitoso. Retorna accessToken y refreshToken' },
          '401': { description: 'Credenciales inválidas' },
          '429': { description: 'Demasiados intentos (Rate Limit)' }
        }
      }
    },
    // --- CARRITO ---
    '/carrito/{clienteId}': {
      get: {
        summary: 'Obtener el carrito de un cliente',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'Carrito obtenido' },
          '401': { description: 'No autorizado (falta token)' },
          '403': { description: 'Prohibido (IDOR)' }
        }
      }
    },
    '/carrito/{clienteId}/items': {
      post: {
        summary: 'Agregar un producto al carrito (HU3)',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  productoId: { type: 'integer', example: 10 },
                  cantidad: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Item agregado exitosamente' },
          '200': { description: 'Cantidad incrementada' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Prohibido' },
          '404': { description: 'Producto no encontrado' },
          '422': { description: 'Stock insuficiente o cantidad inválida' }
        }
      }
    },
    '/carrito/{clienteId}/items/{productoId}': {
      patch: {
        summary: 'Modificar cantidad (HU4)',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'productoId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { cantidad: { type: 'integer', example: 4 } }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Cantidad modificada' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Prohibido' },
          '404': { description: 'Item no encontrado' },
          '422': { description: 'Stock insuficiente o cantidad inválida' }
        }
      },
      delete: {
        summary: 'Eliminar producto (HU5)',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'productoId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '204': { description: 'Producto eliminado' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Prohibido' },
          '404': { description: 'Item no encontrado' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};