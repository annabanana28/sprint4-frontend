interface NavegacaoProps {
  paginaAtual: 'inicio' | 'produtos';
  setPaginaAtual: (pagina: 'inicio' | 'produtos') => void;
}

export function Navegacao({ paginaAtual, setPaginaAtual }: NavegacaoProps) {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--code-bg)'
    }}>
      <strong style={{ fontSize: '20px', color: 'var(--text-h)' }}>📦 StockManager</strong>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className="btn-accent"
          style={{
            background: paginaAtual === 'inicio' ? 'var(--accent)' : 'transparent',
            border: '1px solid var(--border)',
            color: paginaAtual === 'inicio' ? '#fff' : 'var(--text-h)'
          }}
          onClick={() => setPaginaAtual('inicio')}
        >
          Início
        </button>
        <button
          className="btn-accent"
          style={{
            background: paginaAtual === 'produtos' ? 'var(--accent)' : 'transparent',
            border: '1px solid var(--border)',
            color: paginaAtual === 'produtos' ? '#fff' : 'var(--text-h)'
          }}
          onClick={() => setPaginaAtual('produtos')}
        >
          Produtos
        </button>
      </div>
    </nav>
  );
}