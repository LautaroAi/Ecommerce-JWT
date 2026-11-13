# Fase 1 · Definición de Requisitos y Diseño Centrado en el Usuario

- **Proyecto:** XP-Commerce-Backend
- **Equipo:** Federico (catálogo, pedidos, arquitectura) · Lautaro (carrito, CI)
- **Metodología:** Extreme Programming (XP) + BDD con Cucumber
- **Stack:** TypeScript strict · Node.js · Express · Datos en memoria (migrable a PostgreSQL)

---

## Índice

1. [Requisitos Funcionales](#1-requisitos-funcionales--product-backlog)
2. [Requisitos No Funcionales](#2-requisitos-no-funcionales--historias-técnicas)
3. [Resumen del Backlog](#3-resumen-del-product-backlog)
4. [Definition of Done](#4-definition-of-done-dod)
5. [Trazabilidad XP](#5-trazabilidad-xp)

---

## 1. Requisitos Funcionales — Product Backlog

### HU1 · Listar catálogo de productos

> - **Como**
> - **Quiero**
> - **Para**

**Criterios de aceptación:**

1. 
2. 
3. 

**Responsable:** Federico
**Depende de:** —

---

### HU2 · Ver detalle de un producto

> - **Como**
> - **Quiero**
> - **Para**

**Criterios de aceptación:**

1. 
2. 
3. 

**Responsable:** Federico
**Depende de:** HU1

---

### HU3 · Agregar producto al carrito

> - **Como** cliente
> - **Quiero** agregar un producto a mi carrito
> - **Para** comprarlo más tarde.

**Criterios de aceptación:**

1. `POST /api/v1/carrito/:clienteId/items` con `{ productoId, cantidad }` válidos devuelve `201` y el carrito con el ítem agregado; si el ítem ya existía, incrementa la cantidad y devuelve `200`.
2. Devuelve `404 PRODUCT_NOT_FOUND` si el producto no existe y `422 INSUFFICIENT_STOCK` si `cantidad > stock` disponible.
3. Devuelve `422 INVALID_QUANTITY` si `cantidad` no es un entero positivo; el `total` del carrito se recalcula en cada operación.

**Responsable:** Lautaro
**Depende de:** HU1, HU2

---

### HU4 · Modificar cantidad de un producto del carrito

> - **Como** cliente
> - **Quiero** modificar la cantidad de un producto en mi carrito
> - **Para** ajustar mi pedido antes de confirmarlo.

**Criterios de aceptación:**

1. `PATCH /api/v1/carrito/:clienteId/items/:productoId` con `{ cantidad }` válida devuelve `200` y el `subtotal` del ítem y el `total` del carrito actualizados.
2. Devuelve `422 INSUFFICIENT_STOCK` si la nueva cantidad supera el stock y `422 INVALID_QUANTITY` si es cero o negativa.
3. Devuelve `404 ITEM_NOT_FOUND` si el producto no está en el carrito.

**Responsable:** Lautaro
**Depende de:** HU3

---

### HU5 · Eliminar producto del carrito

> - **Como** cliente
> - **Quiero** eliminar un producto de mi carrito
> - **Para** quitar lo que ya no deseo comprar.

**Criterios de aceptación:**

1. `DELETE /api/v1/carrito/:clienteId/items/:productoId` devuelve `204` sin cuerpo si el ítem existe y se elimina correctamente.
2. El `total` del carrito se recalcula; si era el último ítem, el carrito queda con `items: []` y `total: 0`.
3. Devuelve `404 ITEM_NOT_FOUND` si el producto no está en el carrito.

**Responsable:** Lautaro
**Depende de:** HU3

---

### HU6 · Confirmar pedido / checkout

> - **Como**
> - **Quiero**
> - **Para**

**Criterios de aceptación:**

1. 
2. 
3. 

**Responsable:** Federico
**Depende de:** HU4, HU5

---

## 2. Requisitos No Funcionales — Historias Técnicas

### HT1 · Arquitectura por capas + TypeScript strict

> - **Como**
> - **Quiero**
> - **Para**

**Criterios de aceptación:**

1. 
2. 
3. 

**Responsable:** Federico
**Depende de:** —

---

### HT2 · Integración Continua (CI) con GitHub Actions

> - **Como** equipo de desarrollo
> - **Quiero** un pipeline que ejecute lint, compilación y pruebas BDD en cada push y pull request
> - **Para** detectar regresiones temprano y mantener la rama principal siempre en verde.

**Criterios de aceptación:**

1. `.github/workflows/ci.yml` corre en `push` y `pull_request` sobre Node 20.x con `npm ci`.
2. El pipeline ejecuta en orden: `npm run typecheck` → `npm run build` → `npm run test:bdd:hu3`, `npm run test:bdd:hu4`, `npm run test:bdd:hu5` (se ejecutan por separado hasta que HU1 esté en GREEN); falla si cualquiera devuelve error.
3. Publica los reportes HTML generados por Cucumber (`reports/`) como artefacto (`actions/upload-artifact`) incluso si el pipeline falla.

**Responsable:** Lautaro
**Depende de:** HT1

---

## 3. Resumen del Product Backlog

| ID | Tipo | Historia | Responsable | Depende de |
| --- | --- | --- | --- | --- |
| HU1 | Funcional | Listar catálogo | Federico | — |
| HU2 | Funcional | Ver detalle de producto | Federico | HU1 |
| HU3 | Funcional | Agregar producto al carrito | Lautaro | HU1, HU2 |
| HU4 | Funcional | Modificar cantidad | Lautaro | HU3 |
| HU5 | Funcional | Eliminar producto del carrito | Lautaro | HU3 |
| HU6 | Funcional | Confirmar pedido / checkout | Federico | HU4, HU5 |
| HT1 | Técnica | Arquitectura por capas + strict | Federico | — |
| HT2 | Técnica | Integración Continua (CI) | Lautaro | HT1 |

**Distribución de carga:**

- **Federico:** 3 funcionales + 1 técnica (arquitectura)
- **Lautaro:** 3 funcionales + 1 técnica (CI)

---

## 4. Definition of Done (DoD)

Una historia se considera terminada cuando:

1. Tiene su `.feature` en `features/` con al menos un happy path y un caso de error.
2. Los step definitions están implementados en `tests/step_definitions/`.
3. El código de producción pasa el ciclo **RED → GREEN → REFACTOR**.
4. `npm run ci` (lint + build + BDD) pasa en verde localmente y en GitHub Actions.
5. La API responde con códigos HTTP y formato de error consistentes.
6. Fue revisada por otro miembro del equipo (práctica XP: **revisión entre pares**).
7. La decisión de diseño quedó registrada en el README o en el PR.

---

## 5. Trazabilidad XP

| Práctica XP | Dónde se aplica en la Fase 1 |
| --- | --- |
| Historias de usuario | HU1–HU6 redactadas en formato rol/acción/beneficio |
| Planning Game | Asignación Federico/Lautaro y dependencias declaradas |
| On-site customer | Criterios de aceptación como contrato verificable |
| Diseño simple (YAGNI) | HT1 exige la arquitectura mínima sin sobreingeniería |
| Integración continua | HT2 desde el inicio del proyecto, no al final |
| Propiedad colectiva | Cualquier miembro puede tocar cualquier módulo |
| Revisión entre pares | DoD punto 6: toda historia requiere revisión cruzada |
| Refactorización continua | El ciclo RED → GREEN → REFACTOR del DoD punto 3 |

---

## 6. Contrato resumido de la API

| Método | Ruta | Historia | Éxito | Errores |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/productos` | HU1 | 200 | 400 |
| GET | `/api/v1/productos/:id` | HU2 | 200 | 400, 404 |
| POST | `/api/v1/carrito/:clienteId/items` | HU3 | 201 / 200 | 404, 422 |
| PATCH | `/api/v1/carrito/:clienteId/items/:productoId` | HU4 | 200 | 404, 422 |
| DELETE | `/api/v1/carrito/:clienteId/items/:productoId` | HU5 | 204 | 404 |
| POST | `/api/v1/pedidos` | HU6 | 201 | 404, 422 |

### Formato uniforme de error

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "El producto no existe",
    "details": []
  }
}