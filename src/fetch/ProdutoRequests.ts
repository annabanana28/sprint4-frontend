import type { ProdutoDTO } from '../dto/ProdutoDTO';

const API_URL = 'http://localhost:3333/produtos';

export class ProdutoRequests {
  // Buscar todos os produtos
  static async listarTodos(): Promise<ProdutoDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      return await response.json();
    } catch (error) {
      console.error('Erro no fetch listarTodos (Produtos):', error);
      throw error;
    }
  }

  // Cadastrar um novo produto
  static async cadastrar(produto: ProdutoDTO): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch cadastrar (Produto):', error);
      return false;
    }
  }

  // Atualizar/Editar um produto existente (Requisito Sprint 6)
  static async atualizar(codigo: string, produto: Partial<ProdutoDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${codigo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch atualizar (Produto):', error);
      return false;
    }
  }
}