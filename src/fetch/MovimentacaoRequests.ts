import type { MovimentacaoDTO } from '../dto/MovimentacaoDTO';

const API_URL = 'http://localhost:3333/movimentacoes';

export class MovimentacaoRequests {
  // Buscar todas as movimentações
  static async listarTodas(): Promise<MovimentacaoDTO[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao buscar movimentações.');
      return await response.json();
    } catch (error) {
      console.error('Erro no fetch listarTodas (Movimentacoes):', error);
      throw error;
    }
  }

  // Cadastrar uma nova movimentação
  static async cadastrar(movimentacao: MovimentacaoDTO): Promise<boolean> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimentacao),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch cadastrar (Movimentacao):', error);
      return false;
    }
  }

  // Atualizar/Editar uma movimentação existente (Requisito Sprint 6)
  static async atualizar(codigoMovimentacao: number, movimentacao: Partial<MovimentacaoDTO>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${codigoMovimentacao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimentacao),
      });
      return response.ok;
    } catch (error) {
      console.error('Erro no fetch atualizar (Movimentacao):', error);
      return false;
    }
  }
}