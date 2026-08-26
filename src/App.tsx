import { useState, useEffect } from 'react';
import { Navegacao } from './components/Navegacao/Navegacao';
import { BoasVindas } from './components/BoasVindas/BoasVindas';
import { Rodape } from './components/Rodape/Rodape';
import { PHome } from './pages/PHome/PHome';
import { ProdutoRequests } from './fetch/ProdutoRequests';
import type { ProdutoDTO } from './dto/ProdutoDTO';

function App() {
  const [paginaAtual, setPaginaAtual] = useState<'inicio' | 'produtos'>('inicio');
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);

  useEffect(() => {
    ProdutoRequests.listarTodos()
      .then(setProdutos)
      .catch(() => console.error('Erro ao buscar produtos'));
  }, [paginaAtual]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navegacao paginaAtual={paginaAtual} setPaginaAtual={setPaginaAtual} />

      {paginaAtual === 'inicio' ? (
        <BoasVindas produtos={produtos} aoNavegar={setPaginaAtual} />
      ) : (
        <PHome />
      )}

      <Rodape />
    </div>
  );
}

export default App;