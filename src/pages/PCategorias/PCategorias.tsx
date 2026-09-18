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
  const [editando, setEditando] = useState<string | null>(null);

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

  const iniciarEdicao = (cat: CategoriaDTO) => {
    setEditando(cat.nome_categoria);
    setNomeCategoria(cat.nome_categoria);
    setDescricao(cat.descricao || '');
  };

  const cancelarEdicao = () => {
    setEditando(null);
    setNomeCategoria('');
    setDescricao('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nomeCategoria.trim()) {
      exibirMensagem('O nome da categoria é obrigatório!', 'erro');
      return;
    }

    const payload: CategoriaDTO = {
      nome_categoria: nomeCategoria.trim(),
      descricao: descricao.trim() || undefined,
    };

    let sucesso = false;
    if (editando) {
      sucesso = await CategoriaRequests.atualizar(editando, payload);
    } else {
      sucesso = await CategoriaRequests.cadastrar(payload);
    }

    if (sucesso) {
      exibirMensagem(editando ? 'Categoria atualizada com sucesso!' : 'Categoria cadastrada com sucesso!', 'sucesso');
      cancelarEdicao();
      carregarCategorias();
    } else {
      exibirMensagem('Falha ao salvar categoria.', 'erro');
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
        <h2 className="card-title">{editando ? `Editar Categoria: ${editando}` : 'Cadastrar Categoria'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            className="custom-input"
            type="text"
            placeholder="Nome da Categoria *"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            disabled={!!editando}
            required
          />
          <input
            className="custom-input"
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-accent">
              {editando ? 'Salvar Alterações' : 'Cadastrar Categoria'}
            </button>
            {editando && (
              <button type="button" className="btn-accent" style={{ background: '#64748b' }} onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card-box">
        <h2 className="card-title">Lista de Categorias</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.nome_categoria}>
                <td>{cat.nome_categoria}</td>
                <td>{cat.descricao || '-'}</td>
                <td>
                  <button className="btn-accent" style={{ padding: '6px 16px', fontSize: '14px' }} onClick={() => iniciarEdicao(cat)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}