import type { MovimentacaoDTO } from '../dto/MovimentacaoDTO';

const API_URL = 'http://localhost:3333/movimentacoes';

export class MovimentacaoRequests {
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
}