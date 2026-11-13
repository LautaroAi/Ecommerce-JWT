import bcrypt from 'bcrypt';
import { AppError } from '../shared/errors/app-error.js';
import type { UsuariosRepository } from './usuarios.repository.js';
import type { RegistrarUsuarioDto, Usuario } from './usuarios.types.js';

export class UsuariosService {
  constructor(private readonly repository: UsuariosRepository) {}

  async registrar(dto: RegistrarUsuarioDto): Promise<Usuario> {
    const existe = this.repository.buscarPorEmail(dto.email);
    if (existe) {
      throw new AppError(400, 'EMAIL_EXISTS', 'El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    
    const usuario: Usuario = {
      id: this.repository.siguienteId(),
      nombre: dto.nombre,
      email: dto.email,
      passwordHash,
      rol: 'CLIENTE', // Rol por defecto
    };

    return this.repository.guardar(usuario);
  }

  async validarCredenciales(email: string, password: string): Promise<Usuario> {
    const usuario = this.repository.buscarPorEmail(email);
    if (!usuario) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas');
    }

    const valida = await bcrypt.compare(password, usuario.passwordHash);
    if (!valida) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas');
    }

    return usuario;
  }
}