import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { CategoriaDTO } from '../../dto/CategoriaDTO';
import { CategoriaRequests } from '../../fetch/CategoriaRequests';

export function PCategorias() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');

  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const dados = await CategoriaRequests.listarTodas();
      setCategorias(dados);
    } catch {
      exibirMensagem('Erro ao carregar lista de categorias.', 'erro');
    }
  };

  const exibirMensagem = (msg: string, tipo: 'sucesso' | 'erro') => {
    setMensagem(msg);
    setTipoMensagem(tipo);
    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 4000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validação Frontend
    if (!nomeCategoria.trim()) {
      exibirMensagem('O nome da categoria é obrigatório!', 'erro');
      return;
    }

    const novaCategoria: CategoriaDTO = {
      nome_categoria: nomeCategoria.trim(),
      descricao: descricao.trim() || undefined,
    };

    const sucesso = await CategoriaRequests.cadastrar(novaCategoria);

    if (sucesso) {
      exibirMensagem('Categoria cadastrada com sucesso!', 'sucesso');
      setNomeCategoria('');
      setDescricao('');
      carregarCategorias();
    } else {
      exibirMensagem('Falha ao cadastrar categoria. Verifique se o nome já existe!', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gerenciamento de Categorias</h1>

      {mensagem && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          color: '#fff',
          backgroundColor: tipoMensagem === 'sucesso' ? '#22c55e' : '#991b1b'
        }}>
          {mensagem}
        </div>
      )}

      <section className="card-box">
        <h2 className="card-title">Cadastrar Categoria</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            className="custom-input"
            type="text"
            placeholder="Nome da Categoria *"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            required
          />
          <input
            className="custom-input"
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <button type="submit" className="btn-accent">
            Cadastrar Categoria
          </button>
        </form>
      </section>

      <section className="card-box">
        <h2 className="card-title">Lista de Categorias</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.nome_categoria}>
                <td>{cat.nome_categoria}</td>
                <td>{cat.descricao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}