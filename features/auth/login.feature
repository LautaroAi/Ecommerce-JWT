Feature: Inicio de sesión
  Como usuario registrado
  Quiero iniciar sesión
  Para obtener acceso a mis recursos

  Background:
    Given que existe un usuario registrado con email "lauti@test.com" y password "Password123!"

  Scenario: Login exitoso
    When inicio sesion con email "lauti@test.com" y password "Password123!"
    Then la respuesta debe tener codigo 200
    And el cuerpo debe contener un accessToken y un refreshToken

  Scenario: Login falla por contraseña incorrecta
    When inicio sesion con email "lauti@test.com" y password "WrongPassword"
    Then la respuesta debe tener codigo 401
    And el cuerpo del error debe tener el codigo "INVALID_CREDENTIALS"