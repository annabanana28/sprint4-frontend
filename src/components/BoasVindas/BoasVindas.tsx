import type { ProdutoDTO } from '../../dto/ProdutoDTO';

interface BoasVindasProps {
  produtos: ProdutoDTO[];
  aoNavegar: (pagina: 'inicio' | 'produtos') => void;
}

export function BoasVindas({ produtos, aoNavegar }: BoasVindasProps) {
  const totalProdutos = produtos.length;
  const produtosCriticos = produtos.filter(
    (p) => p.quantidade_disponivel <= p.quantidade_minima
  ).length;

  return (
    <div className="app-container">
      <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 className="app-title" style={{ fontSize: '48px', marginBottom: '12px' }}>
          Bem-vindo ao StockManager
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text)' }}>
          Controle simplificado do seu estoque e produtos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card-box" style={{ textAlign: 'center', margin: 0 }}>
          <h3 style={{ margin: '0 0 10px', color: 'var(--text-h)' }}>Total de Produtos</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--accent)' }}>
            {totalProdutos}
          </span>
        </div>

        <div className="card-box" style={{ textAlign: 'center', margin: 0 }}>
          <h3 style={{ margin: '0 0 10px', color: 'var(--text-h)' }}>Estoque Crítico</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>
            {produtosCriticos}
          </span>
        </div>
      </div>

      <div className="card-box" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 className="card-title" style={{ fontSize: '24px' }}>Pronto para gerenciar seu estoque?</h2>
        <p style={{ marginBottom: '24px' }}>Acesse a tabela completa para cadastrar novos itens ou verificar a lista de reposição.</p>
        <button className="btn-accent" style={{ fontSize: '16px', padding: '12px 28px' }} onClick={() => aoNavegar('produtos')}>
          Ir para Gerenciamento de Produtos
        </button>
      </div>
    </div>
  );
}