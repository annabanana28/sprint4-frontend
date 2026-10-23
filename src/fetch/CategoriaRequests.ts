import type { CategoriaDTO } from '../dto/CategoriaDTO';
import { API_BASE_URL } from './apiConfig';

const API_URL = `${API_BASE_URL}/categorias`;

export class CategoriaRequests {
  // Buscar todas as categorias
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

  // Cadastrar uma nova categoria
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

  // Atualizar/Editar uma categoria existente (Requisito Sprint 6)
  static async atualizar(nomeCategoria: string, categoria: Partial<CategoriaDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(nomeCategoria)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch atualizar (Categoria):', error);
      return false;
    }
  }
}