import type { ProdutoDTO } from '../dto/ProdutoDTO';

const API_URL = 'http://localhost:3333/produtos';

export class ProdutoRequests {
  
  static async listarTodos(): Promise<ProdutoDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      return await response.json();
    } catch (error) {
      console.error('Erro no fetch listarTodos:', error);
      throw error;
    }
  }

  static async listarReposicao(): Promise<ProdutoDTO[]> {
    try {
      const response = await fetch(`${API_URL}/reposicao`);
      if (!response.ok) throw new Error('Erro ao buscar produtos para reposição.');
      return await response.json();
    } catch (error) {
      console.error('Erro no fetch listarReposicao:', error);
      throw error;
    }
  }

  static async cadastrar(produto: ProdutoDTO): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch cadastrar:', error);
      return false;
    }
  }
}