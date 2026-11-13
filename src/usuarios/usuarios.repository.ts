import type { Usuario } from './usuarios.types.js';

export class UsuariosRepository {
  private readonly usuarios: Usuario[] = [];
  private nextId = 1;

  buscarPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find((u) => u.email === email);
  }

  buscarPorId(id: number): Usuario | undefined {
    return this.usuarios.find((u) => u.id === id);
  }

  guardar(usuario: Usuario): Usuario {
    const index = this.usuarios.findIndex((u) => u.id === usuario.id);
    if (index >= 0) {
      this.usuarios[index] = usuario;
    } else {
      this.usuarios.push(usuario);
    }
    return usuario;
  }

  siguienteId(): number {
    return this.nextId++;
  }
}