export interface MovimentacaoDTO {
  codigo_movimentacao?: number;
  produto: string;
  tipo: 'ENTRADA' | 'RETIRADA';
  quantidade: number;
  data?: string;
  observacao?: string;
  motivo_retirada?: string;
  preco_unitario?: number;
  valor_total?: number;
}