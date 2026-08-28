interface NavegacaoProps {
  paginaAtual: 'inicio' | 'produtos' | 'categorias' | 'movimentacoes';
  setPaginaAtual: (pagina: 'inicio' | 'produtos' | 'categorias' | 'movimentacoes') => void;
}

export function Navegacao({ paginaAtual, setPaginaAtual }: NavegacaoProps) {
  const getItemStyle = (pagina: string) => ({
    background: paginaAtual === pagina ? 'var(--accent)' : 'transparent',
    border: '1px solid var(--border)',
    color: paginaAtual === pagina ? '#fff' : 'var(--text-h)',
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--code-bg)',
    }}>
      <strong style={{ fontSize: '20px', color: 'var(--text-h)' }}>📦 StockManager</strong>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-accent" style={getItemStyle('inicio')} onClick={() => setPaginaAtual('inicio')}>
          Início
        </button>
        <button className="btn-accent" style={getItemStyle('produtos')} onClick={() => setPaginaAtual('produtos')}>
          Produtos
        </button>
        <button className="btn-accent" style={getItemStyle('categorias')} onClick={() => setPaginaAtual('categorias')}>
          Categorias
        </button>
        <button className="btn-accent" style={getItemStyle('movimentacoes')} onClick={() => setPaginaAtual('movimentacoes')}>
          Movimentações
        </button>
      </div>
    </nav>
  );
}