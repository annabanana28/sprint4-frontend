import type { ProdutoDTO } from '../../dto/ProdutoDTO';
import type { Pagina } from '../../App';

interface BoasVindasProps {
  produtos: ProdutoDTO[];
  aoNavegar: (pagina: Pagina) => void;
}

export function BoasVindas({ produtos, aoNavegar }: BoasVindasProps) {
  const totalProdutos = produtos.length;
  const produtosCriticos = produtos.filter(
    (p) => Number(p.quantidade_disponivel) <= Number(p.quantidade_minima)
  ).length;
  const produtosAtivos = produtos.filter(
    (p) => !p.status || p.status === 'ATIVO'
  ).length;

  return (
    <div className="app-container">
      <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '12px' }}>
        <h1 className="app-title" style={{ marginBottom: '8px' }}>
          Bem-vindo ao StockManager
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text)', margin: 0 }}>
          Controle simplificado do seu estoque, produtos, categorias e movimentações.
        </p>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total de Produtos</h3>
          <span className="stat-value" style={{ color: 'var(--accent)' }}>
            {totalProdutos}
          </span>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Estoque Crítico</h3>
          <span className="stat-value" style={{ color: produtosCriticos > 0 ? '#ef4444' : '#22c55e' }}>
            {produtosCriticos}
          </span>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Produtos Ativos</h3>
          <span className="stat-value" style={{ color: '#22c55e' }}>
            {produtosAtivos}
          </span>
        </div>
      </div>

      {/* Cards de Navegação Rápida */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="card-box" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '18px' }}>📦 Produtos</h3>
            <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 16px' }}>
              Cadastre novos itens, edite informações de preço, estoque mínimo e disponibilidade.
            </p>
          </div>
          <button className="btn-accent" onClick={() => aoNavegar('produtos')}>
            Gerenciar Produtos
          </button>
        </div>

        <div className="card-box" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '18px' }}>🏷️ Categorias</h3>
            <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 16px' }}>
              Organize os departamentos e categorias da sua loja com facilidade.
            </p>
          </div>
          <button className="btn-accent" onClick={() => aoNavegar('categorias')}>
            Gerenciar Categorias
          </button>
        </div>

        <div className="card-box" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '18px' }}>🔄 Movimentações</h3>
            <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 16px' }}>
              Registre entradas e saídas de estoque com controle de motivos e histórico detalhado.
            </p>
          </div>
          <button className="btn-accent" onClick={() => aoNavegar('movimentacoes')}>
            Ver Movimentações
          </button>
        </div>
      </div>
    </div>
  );
}