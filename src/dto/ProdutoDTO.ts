export interface ProdutoDTO {
  codigo_produto: string;
  nome: string;
  descricao?: string;
  categoria: string;
  preco_unitario: number | string;
  quantidade_disponivel: number;
  quantidade_minima: number;
  status?: string;
}