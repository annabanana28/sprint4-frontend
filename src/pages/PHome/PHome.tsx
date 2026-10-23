import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { ProdutoDTO } from '../../dto/ProdutoDTO';
import type { CategoriaDTO } from '../../dto/CategoriaDTO';
import { ProdutoRequests } from '../../fetch/ProdutoRequests';
import { CategoriaRequests } from '../../fetch/CategoriaRequests';

export function PHome() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
  const [carregando, setCarregando] = useState(true);

  const [editandoCodigo, setEditandoCodigo] = useState<string | null>(null);
  const [codigoProduto, setCodigoProduto] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');
  const [quantidadeMinima, setQuantidadeMinima] = useState('');
  const [status, setStatus] = useState<'ATIVO' | 'DESATIVADO'>('ATIVO');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [prodsRes, catsRes] = await Promise.allSettled([
        ProdutoRequests.listarTodos(),
        CategoriaRequests.listarTodas(),
      ]);

      if (prodsRes.status === 'fulfilled') {
        setProdutos(prodsRes.value);
      } else {
        console.error('Erro ao listar produtos:', prodsRes.reason);
      }

      if (catsRes.status === 'fulfilled') {
        setCategorias(catsRes.value);
      } else {
        console.error('Erro ao listar categorias:', catsRes.reason);
      }

      if (prodsRes.status === 'rejected' && catsRes.status === 'rejected') {
        exibirMensagem('Não foi possível conectar ao servidor backend.', 'erro');
      }
    } catch {
      exibirMensagem('Erro inesperado ao carregar dados dos produtos.', 'erro');
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

  const iniciarEdicao = (p: ProdutoDTO) => {
    setEditandoCodigo(p.codigo_produto);
    setCodigoProduto(p.codigo_produto);
    setNome(p.nome);
    setDescricao(p.descricao || '');
    setCategoria(p.categoria);
    setPrecoUnitario(String(p.preco_unitario));
    setQuantidadeDisponivel(String(p.quantidade_disponivel));
    setQuantidadeMinima(String(p.quantidade_minima));
    setStatus((p.status as 'ATIVO' | 'DESATIVADO') || 'ATIVO');

    // Rola suavemente até o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setEditandoCodigo(null);
    setCodigoProduto('');
    setNome('');
    setDescricao('');
    setCategoria('');
    setPrecoUnitario('');
    setQuantidadeDisponivel('');
    setQuantidadeMinima('');
    setStatus('ATIVO');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!codigoProduto.trim() || !nome.trim() || !categoria) {
      exibirMensagem('Preencha os campos obrigatórios (Código, Nome e Categoria)!', 'erro');
      return;
    }

    // Tratamento para aceitar vírgula ou ponto no preço
    const precoTratado = precoUnitario.replace(',', '.');
    const preco = parseFloat(precoTratado);
    const qtdDisp = parseInt(quantidadeDisponivel);
    const qtdMin = parseInt(quantidadeMinima);

    if (isNaN(preco) || preco < 0) {
      exibirMensagem('Preço unitário deve ser um número maior ou igual a zero!', 'erro');
      return;
    }

    if (isNaN(qtdDisp) || qtdDisp < 0 || isNaN(qtdMin) || qtdMin < 0) {
      exibirMensagem('As quantidades não podem ser valores negativos!', 'erro');
      return;
    }

    const payload: ProdutoDTO = {
      codigo_produto: codigoProduto.trim(),
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      categoria,
      preco_unitario: preco,
      quantidade_disponivel: qtdDisp,
      quantidade_minima: qtdMin,
      status,
    };

    let sucesso = false;
    if (editandoCodigo) {
      sucesso = await ProdutoRequests.atualizar(editandoCodigo, payload);
    } else {
      sucesso = await ProdutoRequests.cadastrar(payload);
    }

    if (sucesso) {
      exibirMensagem(
        editandoCodigo ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
        'sucesso'
      );
      cancelarEdicao();
      carregarDados();
    } else {
      exibirMensagem('Falha ao salvar produto. Verifique os dados e tente novamente.', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gerenciamento de Produtos</h1>

      {mensagem && (
        <div className={`alert-box ${tipoMensagem === 'sucesso' ? 'alert-success' : 'alert-error'}`}>
          <span>{mensagem}</span>
        </div>
      )}

      {/* Formulário de Cadastro / Edição */}
      <section className="card-box">
        <h2 className="card-title">
          <span>{editandoCodigo ? `✏️ Editar Produto: ${editandoCodigo}` : '➕ Cadastrar Novo Produto'}</span>
          {editandoCodigo && (
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
            <label htmlFor="codigo">Código do Produto *</label>
            <input
              id="codigo"
              className="custom-input"
              type="text"
              placeholder="Ex: PROD-001"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
              disabled={!!editandoCodigo}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nome">Nome do Produto *</label>
            <input
              id="nome"
              className="custom-input"
              type="text"
              placeholder="Ex: Teclado Mecânico RGB"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              className="custom-input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione a Categoria</option>
              {categorias.map((c) => (
                <option key={c.nome_categoria} value={c.nome_categoria}>
                  {c.nome_categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço Unitário (R$) *</label>
            <input
              id="preco"
              className="custom-input"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 199.90"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="qtdDisp">Qtd. Disponível *</label>
            <input
              id="qtdDisp"
              className="custom-input"
              type="number"
              min="0"
              placeholder="Ex: 25"
              value={quantidadeDisponivel}
              onChange={(e) => setQuantidadeDisponivel(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="qtdMin">Qtd. Mínima (Alerta) *</label>
            <input
              id="qtdMin"
              className="custom-input"
              type="number"
              min="0"
              placeholder="Ex: 5"
              value={quantidadeMinima}
              onChange={(e) => setQuantidadeMinima(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="custom-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ATIVO' | 'DESATIVADO')}
            >
              <option value="ATIVO">ATIVO</option>
              <option value="DESATIVADO">DESATIVADO</option>
            </select>
          </div>

          <div className="form-group form-full">
            <label htmlFor="descricao">Descrição (Opcional)</label>
            <input
              id="descricao"
              className="custom-input"
              type="text"
              placeholder="Descrição breve das características do produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="form-full form-actions">
            <button type="submit" className="btn-accent">
              {editandoCodigo ? '💾 Salvar Alterações' : '➕ Cadastrar Produto'}
            </button>
            {editandoCodigo && (
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

      {/* Tabela de Produtos */}
      <section className="card-box">
        <h2 className="card-title">
          <span>📋 Lista de Produtos ({produtos.length})</span>
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={carregarDados}
            title="Recarregar dados"
          >
            🔄 Atualizar
          </button>
        </h2>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Disponível</th>
                <th>Mínima</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Carregando produtos...
                  </td>
                </tr>
              ) : produtos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Nenhum produto cadastrado até o momento.
                  </td>
                </tr>
              ) : (
                produtos.map((p) => {
                  const critico = Number(p.quantidade_disponivel) <= Number(p.quantidade_minima);
                  const precoFormatado = Number(p.preco_unitario || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  });

                  return (
                    <tr key={p.codigo_produto}>
                      <td>
                        <strong>{p.codigo_produto}</strong>
                      </td>
                      <td>{p.nome}</td>
                      <td>{p.categoria}</td>
                      <td>{precoFormatado}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: critico ? '#ef4444' : '#4ade80',
                          }}
                        >
                          {p.quantidade_disponivel} {critico ? '⚠️' : ''}
                        </span>
                      </td>
                      <td>{p.quantidade_minima}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.status === 'DESATIVADO' ? 'badge-desativado' : 'badge-ativo'
                          }`}
                        >
                          {p.status || 'ATIVO'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-accent btn-sm"
                          onClick={() => iniciarEdicao(p)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}