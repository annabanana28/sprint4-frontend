import { useState, useEffect } from 'react';

interface NavegacaoProps {
  paginaAtual: 'inicio' | 'produtos' | 'categorias' | 'movimentacoes';
  setPaginaAtual: (pagina: 'inicio' | 'produtos' | 'categorias' | 'movimentacoes') => void;
  onLogout?: () => void;
}

export function Navegacao({ paginaAtual, setPaginaAtual, onLogout }: NavegacaoProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    try {
      const usuarioArmazenado = localStorage.getItem('@StockManager:usuario');
      if (usuarioArmazenado) {
        const parsed = JSON.parse(usuarioArmazenado);
        setNomeUsuario(parsed.nome || parsed.login || 'Usuário');
      }
    } catch {
      setNomeUsuario('');
    }
  }, []);

  const navegarPara = (pagina: 'inicio' | 'produtos' | 'categorias' | 'movimentacoes') => {
    setPaginaAtual(pagina);
    setMenuAberto(false);
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <span>📦</span>
        <span>StockManager</span>
      </div>

      <button
        className="nav-mobile-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        {menuAberto ? '✕' : '☰'}
      </button>

      <nav className={`nav-menu ${menuAberto ? 'open' : ''}`}>
        <button
          className={`nav-btn ${paginaAtual === 'inicio' ? 'active' : ''}`}
          onClick={() => navegarPara('inicio')}
        >
          Início
        </button>
        <button
          className={`nav-btn ${paginaAtual === 'produtos' ? 'active' : ''}`}
          onClick={() => navegarPara('produtos')}
        >
          Produtos
        </button>
        <button
          className={`nav-btn ${paginaAtual === 'categorias' ? 'active' : ''}`}
          onClick={() => navegarPara('categorias')}
        >
          Categorias
        </button>
        <button
          className={`nav-btn ${paginaAtual === 'movimentacoes' ? 'active' : ''}`}
          onClick={() => navegarPara('movimentacoes')}
        >
          Movimentações
        </button>

        {onLogout && (
          <div className="nav-user">
            {nomeUsuario && <span className="nav-user-name">👤 {nomeUsuario}</span>}
            <button className="nav-logout-btn" onClick={onLogout} title="Encerrar sessão">
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}