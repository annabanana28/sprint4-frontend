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
    try {
      const [prods, cats] = await Promise.all([
        ProdutoRequests.listarTodos(),
        CategoriaRequests.listarTodas(),
      ]);
      setProdutos(prods);
      setCategorias(cats);
    } catch {
      exibirMensagem('Erro ao carregar dados dos produtos.', 'erro');
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

    const preco = parseFloat(precoUnitario);
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
      exibirMensagem(editandoCodigo ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!', 'sucesso');
      cancelarEdicao();
      carregarDados();
    } else {
      exibirMensagem('Falha ao salvar produto.', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gerenciamento de Produtos</h1>

      {mensagem && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          color: '#fff',
          backgroundColor: tipoMensagem === 'sucesso' ? '#22c55e' : '#991b1b',
        }}>
          {mensagem}
        </div>
      )}

      <section className="card-box">
        <h2 className="card-title">{editandoCodigo ? `Editar Produto: ${editandoCodigo}` : 'Cadastrar Produto'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            className="custom-input"
            type="text"
            placeholder="Código do Produto *"
            value={codigoProduto}
            onChange={(e) => setCodigoProduto(e.target.value)}
            disabled={!!editandoCodigo}
            required
          />

          <input
            className="custom-input"
            type="text"
            placeholder="Nome *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            className="custom-input"
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <select
            className="custom-input"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione a Categoria *</option>
            {categorias.map((c) => (
              <option key={c.nome_categoria} value={c.nome_categoria}>
                {c.nome_categoria}
              </option>
            ))}
          </select>

          <input
            className="custom-input"
            type="number"
            step="0.01"
            placeholder="Preço (R$) *"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
            required
          />

          <input
            className="custom-input"
            type="number"
            placeholder="Qtd. Disponível *"
            value={quantidadeDisponivel}
            onChange={(e) => setQuantidadeDisponivel(e.target.value)}
            required
          />

          <input
            className="custom-input"
            type="number"
            placeholder="Qtd. Mínima *"
            value={quantidadeMinima}
            onChange={(e) => setQuantidadeMinima(e.target.value)}
            required
          />

          <select
            className="custom-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ATIVO' | 'DESATIVADO')}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="DESATIVADO">DESATIVADO</option>
          </select>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-accent">
              {editandoCodigo ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
            {editandoCodigo && (
              <button type="button" className="btn-accent" style={{ background: '#64748b' }} onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card-box">
        <h2 className="card-title">Lista de Produtos</h2>
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.codigo_produto}>
                <td>{p.codigo_produto}</td>
                <td>{p.nome}</td>
                <td>{p.categoria}</td>
                <td>R$ {Number(p.preco_unitario).toFixed(2)}</td>
                <td style={{ color: p.quantidade_disponivel <= p.quantidade_minima ? '#ef4444' : 'inherit' }}>
                  {p.quantidade_disponivel}
                </td>
                <td>{p.quantidade_minima}</td>
                <td>{p.status}</td>
                <td>
                  <button className="btn-accent" style={{ padding: '6px 16px', fontSize: '14px' }} onClick={() => iniciarEdicao(p)}>
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