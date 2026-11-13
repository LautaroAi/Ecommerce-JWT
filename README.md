# XP Commerce Backend

Backend de una plataforma de e-commerce desarrollado con **TypeScript**, orientado a un caso de uso real y construido aplicando prácticas de **Extreme Programming (XP)**.

El proyecto busca resolver un flujo comercial concreto de forma simple, mantenible y verificable, priorizando historias de usuario, criterios de aceptación, pruebas automatizadas y una arquitectura clara por capas.

## Objetivo

Diseñar e implementar una API REST capaz de gestionar el núcleo de una experiencia de compra online, incluyendo catálogo de productos, carrito y generación de pedidos.

La solución se plantea como una base reutilizable para un comercio real, evitando sobreingeniería y manteniendo el foco en funcionalidades que puedan evolucionar progresivamente.

## Alcance inicial

El MVP contempla las siguientes capacidades:

- listar productos disponibles;
- consultar el detalle de un producto;
- agregar productos al carrito;
- modificar cantidades dentro del carrito;
- eliminar productos del carrito;
- confirmar una compra y generar un pedido.

## Enfoque XP

El desarrollo sigue una dinámica incremental basada en prácticas de Extreme Programming:

- **Historias de Usuario:** cada funcionalidad parte de una necesidad concreta del cliente.
- **BDD con Cucumber:** los criterios de aceptación se traducen a escenarios Gherkin ejecutables.
- **TDD/BDD:** primero se define el comportamiento esperado, luego se implementa la solución mínima necesaria para hacerlo pasar.
- **Diseño simple:** se evita agregar complejidad que no sea requerida por el comportamiento actual.
- **Refactorización continua:** una vez alcanzado el comportamiento esperado, se mejora el código sin alterar su resultado.
- **Integración continua:** el proyecto cuenta con un pipeline en GitHub Actions que valida tipos, compilación y pruebas BDD automáticamente en cada push.

## Arquitectura prevista

La aplicación se organiza separando responsabilidades:

```text
Cliente HTTP
    ↓
Router / Controller
    ↓
Service
    ↓
Repository
    ↓
Persistencia
```

Esta separación permite modificar la estrategia de persistencia sin alterar la lógica de negocio ni los controladores.

## Dominio principal

El backend se organiza inicialmente alrededor de tres módulos:

```text
src/
├── productos/
├── carrito/
└── pedidos/
```

### Productos

Responsable del catálogo comercial, disponibilidad y consulta individual de cada producto.

### Carrito

Gestiona los productos seleccionados por el cliente y sus cantidades antes de confirmar la operación.

### Pedidos

Representa la confirmación final de una compra y concentra las validaciones necesarias para transformar un carrito en un pedido.

## Tecnologías previstas

- Node.js
- TypeScript
- Express
- Cucumber
- Gherkin
- GitHub Actions

La persistencia se mantendrá desacoplada de la lógica de negocio para permitir una evolución posterior hacia una base de datos real mediante un ORM si el proyecto lo requiere.

## Estructura esperada

```text
XP-Commerce-Backend/
├── features/
│   ├── productos/
│   ├── carrito/
│   └── pedidos/
├── src/
│   ├── productos/
│   ├── carrito/
│   ├── pedidos/
│   ├── shared/
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── step_definitions/
├── .github/
│   └── workflows/
├── package.json
├── tsconfig.json
└── README.md
```

## Historias funcionales iniciales

1. Como cliente, quiero ver el catálogo de productos para conocer las opciones disponibles.
2. Como cliente, quiero consultar el detalle de un producto para conocer su precio, descripción y disponibilidad.
3. Como cliente, quiero agregar un producto al carrito para preparar mi compra.
4. Como cliente, quiero modificar la cantidad de un producto del carrito para ajustar mi pedido.
5. Como cliente, quiero eliminar un producto del carrito para corregir mi compra.
6. Como cliente, quiero confirmar mi carrito para generar un pedido.

Cada historia contará con criterios de aceptación y escenarios BDD que contemplen tanto el camino esperado como casos de error o límite.

## Flujo de trabajo

El equipo trabajará sobre una base común y luego dividirá la implementación por módulos e historias de usuario.

Cada funcionalidad seguirá este ciclo:

```text
Historia de Usuario
       ↓
Criterios de Aceptación
       ↓
Escenario Gherkin
       ↓
Prueba en rojo
       ↓
Implementación mínima
       ↓
Prueba en verde
       ↓
Refactorización
```

## Seguridad y Autenticación

La API implementa un modelo de seguridad basado en **JWT (JSON Web Tokens)**, **RBAC (Role-Based Access Control)** y prevención de **IDOR (Insecure Direct Object Reference)**, alineado con las recomendaciones de OWASP.

### Características de seguridad implementadas:
- **Hashing de contraseñas:** Uso de `bcrypt` con un factor de costo de 12 (`saltRounds`), lo que aplica 4.096 iteraciones para proteger las credenciales contra ataques de fuerza bruta.
- **Tokens duales:** 
  - `Access Token` (15 min) para acceder a rutas protegidas.
  - `Refresh Token` (7 días) para renovar el Access Token sin volver a iniciar sesión.
- **Protección de Rutas (RBAC):** Los middlewares `requireAuth` y `requireRole` aseguran que solo los usuarios autenticados y con el rol adecuado (ej. `ADMIN`) puedan acceder a ciertos endpoints.
- **Prevención de IDOR:** El middleware `checkOwnership` verifica que un `CLIENTE` solo pueda acceder a su propio carrito (`/api/v1/carrito/:clienteId`), bloqueando intentos de acceso a recursos ajenos.
- **Rate Limiting:** Límite de 5 intentos cada 15 minutos en el endpoint de login para mitigar ataques de fuerza bruta.
- **Sanitización y Validación:** Uso de `Zod` para validar estrictamente los esquemas de entrada y evitar inyecciones (Mass Assignment).
- **Logs Seguros:** Implementación de `pino` con redacción automática de datos sensibles (contraseñas y tokens) en los logs.

### Endpoints de Autenticación:
- `POST /api/v1/auth/register`: Registro de nuevos usuarios (Rol por defecto: `CLIENTE`).
- `POST /api/v1/auth/login`: Inicio de sesión (retorna Access y Refresh tokens).
- `POST /api/v1/auth/refresh`: Renovación del Access Token.

## Ejecución de pruebas BDD

El proyecto utiliza Cucumber 12 con soporte para ESM y TypeScript mediante `tsx`. Para ejecutar las pruebas localmente:

```bash
# Ejecutar todos los escenarios (se ignora hasta que estén todas en GREEN)
npm run test:bdd

# Ejecutar pruebas de una Historia de Usuario específica o módulo específico
npm run test:bdd:hu3
npm run test:bdd:hu4
npm run test:bdd:hu5
npm run test:bdd:auth
```

Los reportes en formato HTML se generan automáticamente en la carpeta `reports/` (ignorada por Git) al ejecutar los comandos.

## Integración Continua (CI)
El pipeline de CI está configurado en `.github/workflows/ci.yml` y se ejecuta en cada `push` y `pull_request` hacia la rama `main` o ramas `feature/*`.

El flujo consta de los siguientes pasos:

1. **Typecheck:** Valida los tipos estrictos de TypeScript (`tsc --noEmit`).
2. **Build:** Compila el proyecto a la carpeta dist/.
3. **BDD Tests:** Ejecuta las pruebas de Cucumber para HU3, HU4, HU5 y Auth.
4. **Artifacts:** Sube los reportes HTML de Cucumber como artefacto descargable en GitHub Actions.

## Documentación de la API

La API cuenta con documentación interactiva generada con Swagger UI. Una vez levantado el servidor (`npm run dev`), podés acceder a:

```bash
http://localhost:3000/api/v1/docs
```

Desde allí podés explorar los endpoints de autenticación y carrito, y probarlos directamente. Para probar las rutas protegidas del carrito, primero debés hacer login y usar el botón "Authorize" (candado) en Swagger UI para inyectar el token JWT.

## Estado

🚧 Proyecto en desarrollo.

El módulo de carrito (HU3, HU4, HU5) y la Integración Continua (HT2) se encuentran implementados y con pruebas en verde. Las etapas siguientes incluyen completar el catálogo de productos y el flujo de checkout.
