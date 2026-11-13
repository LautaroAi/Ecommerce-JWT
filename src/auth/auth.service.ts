import jwt from 'jsonwebtoken';
import { env } from '../shared/config/env.js';
import { AppError } from '../shared/errors/app-error.js';
import type { UsuariosService } from '../usuarios/usuarios.service.js';
import type { Usuario } from '../usuarios/usuarios.types.js';

export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(email: string, password: string) {
    const usuario = await this.usuariosService.validarCredenciales(email, password);
    return this.generarTokens(usuario);
  }

  generarTokens(usuario: Usuario) {
    const payload = { id: usuario.id, rol: usuario.rol };
    
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: number, rol: string };
      const payload = { id: decoded.id, rol: decoded.rol };
      const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
      return { accessToken };
    } catch {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token inválido o expirado');
    }
  }
}