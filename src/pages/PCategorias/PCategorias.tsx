import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { CategoriaDTO } from '../../dto/CategoriaDTO';
import { CategoriaRequests } from '../../fetch/CategoriaRequests';

export function PCategorias() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
  const [carregando, setCarregando] = useState(true);

  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setCarregando(true);
    try {
      const dados = await CategoriaRequests.listarTodas();
      setCategorias(dados);
    } catch {
      exibirMensagem('Erro ao carregar lista de categorias. Verifique se o servidor backend está online.', 'erro');
    } finally {
      setCarregando(false);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      exibirMensagem(
        editando ? 'Categoria atualizada com sucesso!' : 'Categoria cadastrada com sucesso!',
        'sucesso'
      );
      cancelarEdicao();
      carregarCategorias();
    } else {
      exibirMensagem('Falha ao salvar categoria. Verifique se o nome já não está cadastrado.', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gerenciamento de Categorias</h1>

      {mensagem && (
        <div className={`alert-box ${tipoMensagem === 'sucesso' ? 'alert-success' : 'alert-error'}`}>
          <span>{mensagem}</span>
        </div>
      )}

      {/* Formulário */}
      <section className="card-box">
        <h2 className="card-title">
          <span>{editando ? `✏️ Editar Categoria: ${editando}` : '➕ Cadastrar Nova Categoria'}</span>
          {editando && (
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={cancelarEdicao}
            >
              Cancelar Edição
            </button>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="nomeCat">Nome da Categoria *</label>
            <input
              id="nomeCat"
              className="custom-input"
              type="text"
              placeholder="Ex: Periféricos, Componentes..."
              value={nomeCategoria}
              onChange={(e) => setNomeCategoria(e.target.value)}
              disabled={!!editando}
              required
            />
          </div>

          <div className="form-group form-full">
            <label htmlFor="descCat">Descrição (Opcional)</label>
            <input
              id="descCat"
              className="custom-input"
              type="text"
              placeholder="Ex: Acessórios e periféricos para computadores em geral"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="form-full form-actions">
            <button type="submit" className="btn-accent">
              {editando ? '💾 Salvar Alterações' : '➕ Cadastrar Categoria'}
            </button>
            {editando && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Tabela de Categorias */}
      <section className="card-box">
        <h2 className="card-title">
          <span>🏷️ Categorias Cadastradas ({categorias.length})</span>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={carregarCategorias}
            title="Recarregar dados"
          >
            🔄 Atualizar
          </button>
        </h2>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Nome da Categoria</th>
                <th>Descrição</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={3} className="empty-state">
                    Carregando categorias...
                  </td>
                </tr>
              ) : categorias.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-state">
                    Nenhuma categoria cadastrada até o momento.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.nome_categoria}>
                    <td>
                      <strong>{cat.nome_categoria}</strong>
                    </td>
                    <td>{cat.descricao || <span style={{ color: '#64748b' }}>- Sem descrição -</span>}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn-accent btn-sm"
                        onClick={() => iniciarEdicao(cat)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}