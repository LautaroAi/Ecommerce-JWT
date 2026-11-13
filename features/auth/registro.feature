Feature: Registro de usuarios
  Como visitante
  Quiero registrarme en la plataforma
  Para poder comprar y tener un carrito propio

  Scenario: Registro exitoso con datos válidos
    When me registro con nombre "Lauti", email "lauti@test.com" y password "Password123!"
    Then la respuesta debe tener codigo 201
    And el cuerpo debe contener un mensaje de exito

  Scenario: Registro falla por email duplicado
    Given que ya existe un usuario con email "lauti@test.com"
    When me registro con nombre "Otro", email "lauti@test.com" y password "Password123!"
    Then la respuesta debe tener codigo 400
    And el cuerpo del error debe tener el codigo "EMAIL_EXISTS"

  Scenario: Registro falla por contraseña debil
    When me registro con nombre "Lauti", email "lauti2@test.com" y password "123"
    Then la respuesta debe tener codigo 422
    And el cuerpo del error debe tener el codigo "INVALID_DATA"