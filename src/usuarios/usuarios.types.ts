export type Rol = 'CLIENTE' | 'ADMIN';

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Rol;
};

export type RegistrarUsuarioDto = {
  nombre: string;
  email: string;
  password: string;
};