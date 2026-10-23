import { useState, useEffect } from 'react';
import { Navegacao } from './components/Navegacao/Navegacao';
import { BoasVindas } from './components/BoasVindas/BoasVindas';
import { Rodape } from './components/Rodape/Rodape';
import { PHome } from './pages/PHome/PHome';
import { PCategorias } from './pages/PCategorias/PCategorias';
import { PMovimentacoes } from './pages/PMovimentacoes/PMovimentacoes';
import { ProdutoRequests } from './fetch/ProdutoRequests';
import type { ProdutoDTO } from './dto/ProdutoDTO';

export type Pagina = 'inicio' | 'produtos' | 'categorias' | 'movimentacoes';

function App() {
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    return !!localStorage.getItem('@StockManager:usuario');
  });

  const [paginaAtual, setPaginaAtual] = useState<Pagina>('inicio');
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);

  useEffect(() => {
    if (autenticado) {
      ProdutoRequests.listarTodos()
        .then(setProdutos)
        .catch(() => console.error('Erro ao buscar produtos'));
    }
  }, [paginaAtual, autenticado]);

  const handleLogout = () => {
    localStorage.removeItem('@StockManager:usuario');
    setAutenticado(false);
    setPaginaAtual('inicio');
  };

  // Se não estiver autenticado, exibe a tela de boas-vindas/login
  if (!autenticado) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
        <BoasVindas produtos={produtos} aoNavegar={setPaginaAtual} />
      </div>
    );
  }

  // Se estiver autenticado, exibe a aplicação completa
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navegacao
        paginaAtual={paginaAtual}
        setPaginaAtual={setPaginaAtual}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {paginaAtual === 'inicio' && <BoasVindas produtos={produtos} aoNavegar={setPaginaAtual} />}
        {paginaAtual === 'produtos' && <PHome />}
        {paginaAtual === 'categorias' && <PCategorias />}
        {paginaAtual === 'movimentacoes' && <PMovimentacoes />}
      </main>

      <Rodape />
    </div>
  );
}

export default App;