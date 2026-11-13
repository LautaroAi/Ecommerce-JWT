Feature: Seguridad y Autorización
  Como sistema
  Quiero proteger los recursos
  Para evitar accesos no autorizados y IDOR

  Background:
    Given que existe un usuario registrado con rol "CLIENTE" y email "cliente@test.com"
    And que existe un usuario registrado con rol "ADMIN" y email "admin@test.com"

  Scenario: Acceso denegado sin token
    When intento ver el carrito del cliente 1 sin token
    Then la respuesta debe tener codigo 401
    And el cuerpo del error debe tener el codigo "UNAUTHORIZED"

  Scenario: Acceso denegado a ruta de ADMIN
    Given inicio sesion como "cliente@test.com"
    When intento acceder a la ruta de administrador
    Then la respuesta debe tener codigo 403
    And el cuerpo del error debe tener el codigo "FORBIDDEN"

  Scenario: IDOR - Cliente no puede ver carrito ajeno
    Given inicio sesion como "cliente@test.com"
    When intento ver el carrito del cliente 999
    Then la respuesta debe tener codigo 403
    And el cuerpo del error debe tener el codigo "FORBIDDEN"