export const swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'XP-Commerce API',
    version: '1.0.0',
    description: 'API REST para el carrito de compras (HU3, HU4, HU5)'
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Servidor local'
    }
  ],
  paths: {
    '/carrito/{clienteId}': {
      get: {
        summary: 'Obtener el carrito de un cliente',
        tags: ['Carrito'],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Carrito obtenido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Carrito' } } }
          }
        }
      }
    },
    '/carrito/{clienteId}/items': {
      post: {
        summary: 'Agregar un producto al carrito (HU3)',
        tags: ['Carrito'],
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
          '200': { description: 'Cantidad incrementada en item existente' },
          '404': { description: 'Producto no encontrado' },
          '422': { description: 'Stock insuficiente o cantidad invalida' }
        }
      }
    },
    '/carrito/{clienteId}/items/{productoId}': {
      patch: {
        summary: 'Modificar cantidad de un producto (HU4)',
        tags: ['Carrito'],
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
                properties: {
                  cantidad: { type: 'integer', example: 4 }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Cantidad modificada' },
          '404': { description: 'Item no encontrado' },
          '422': { description: 'Stock insuficiente o cantidad invalida' }
        }
      },
      delete: {
        summary: 'Eliminar producto del carrito (HU5)',
        tags: ['Carrito'],
        parameters: [
          { name: 'clienteId', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'productoId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '204': { description: 'Producto eliminado' },
          '404': { description: 'Item no encontrado' }
        }
      }
    }
  },
  components: {
    schemas: {
      Carrito: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          clienteId: { type: 'integer' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productoId: { type: 'integer' },
                nombre: { type: 'string' },
                cantidad: { type: 'integer' },
                precioUnitario: { type: 'number' },
                subtotal: { type: 'number' }
              }
            }
          },
          total: { type: 'number' }
        }
      }
    }
  }
};