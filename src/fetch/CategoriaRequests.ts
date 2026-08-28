import type { CategoriaDTO } from '../dto/CategoriaDTO';

const API_URL = 'http://localhost:3333/categorias';

export class CategoriaRequests {
  static async listarTodas(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar categorias.');
      return await response.json();
    } catch (error) {
      console.error('Erro no fetch listarTodas (Categorias):', error);
      throw error;
    }
  }

  static async cadastrar(categoria: CategoriaDTO): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch cadastrar (Categoria):', error);
      return false;
    }
  }
}