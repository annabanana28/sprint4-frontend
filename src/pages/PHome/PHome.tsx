import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { ProdutoDTO } from '../../dto/ProdutoDTO';
import { ProdutoRequests } from '../../fetch/ProdutoRequests';

export function PHome() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [mensagem, setMensagem] = useState<string>('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');

  const [codigoProduto, setCodigoProduto] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [qtdDisponivel, setQtdDisponivel] = useState('');
  const [qtdMinima, setQtdMinima] = useState('');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const dados = await ProdutoRequests.listarTodos();
      setProdutos(dados);
    } catch {
      exibirMensagem('Erro ao carregar a lista de produtos.', 'erro');
    }
  };

  const carregarReposicao = async () => {
    try {
      const dados = await ProdutoRequests.listarReposicao();
      setProdutos(dados);
    } catch {
      exibirMensagem('Erro ao carregar lista de reposição.', 'erro');
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

    if (!codigoProduto.trim() || !nome.trim() || !categoria.trim()) {
      exibirMensagem('Preencha todos os campos obrigatórios!', 'erro');
      return;
    }

    const preco = parseFloat(precoUnitario);
    const disponivel = parseInt(qtdDisponivel);
    const minima = parseInt(qtdMinima);

    if (isNaN(preco) || preco <= 0) {
      exibirMensagem('O preço unitário deve ser maior que zero!', 'erro');
      return;
    }

    if (isNaN(disponivel) || disponivel < 0 || isNaN(minima) || minima < 0) {
      exibirMensagem('As quantidades não podem ser negativas!', 'erro');
      return;
    }

    const novoProduto: ProdutoDTO = {
      codigo_produto: codigoProduto,
      nome,
      descricao,
      categoria,
      preco_unitario: preco,
      quantidade_disponivel: disponivel,
      quantidade_minima: minima,
      status: 'ATIVO'
    };

    const sucesso = await ProdutoRequests.cadastrar(novoProduto);

    if (sucesso) {
      exibirMensagem('Produto cadastrado com sucesso!', 'sucesso');
      setCodigoProduto('');
      setNome('');
      setDescricao('');
      setCategoria('');
      setPrecoUnitario('');
      setQtdDisponivel('');
      setQtdMinima('');
      carregarProdutos();
    } else {
      exibirMensagem('Falha ao cadastrar produto. Verifique os dados informados!', 'erro');
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
          backgroundColor: tipoMensagem === 'sucesso' ? '#22c55e' : '#991b1b'
        }}>
          {mensagem}
        </div>
      )}

      <section className="card-box">
        <h2 className="card-title">Cadastrar Produto</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input className="custom-input" type="text" placeholder="Código do Produto *" value={codigoProduto} onChange={e => setCodigoProduto(e.target.value)} required />
          <input className="custom-input" type="text" placeholder="Nome *" value={nome} onChange={e => setNome(e.target.value)} required />
          <input className="custom-input" type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <input className="custom-input" type="text" placeholder="Categoria *" value={categoria} onChange={e => setCategoria(e.target.value)} required />
          <input className="custom-input" type="number" step="0.01" placeholder="Preço (R$) *" value={precoUnitario} onChange={e => setPrecoUnitario(e.target.value)} required />
          <input className="custom-input" type="number" placeholder="Qtd. Disponível *" value={qtdDisponivel} onChange={e => setQtdDisponivel(e.target.value)} required />
          <input className="custom-input" type="number" placeholder="Qtd. Mínima *" value={qtdMinima} onChange={e => setQtdMinima(e.target.value)} required />
          
          <button type="submit" className="btn-accent">
            Cadastrar Produto
          </button>
        </form>
      </section>

      <section className="card-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Lista de Produtos</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={carregarProdutos} className="btn-accent" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-h)' }}>Todos</button>
            <button onClick={carregarReposicao} className="btn-accent" style={{ background: '#ef4444' }}>Reposição</button>
          </div>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Disponível</th>
              <th>Mínima</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.codigo_produto}>
                <td>{p.codigo_produto}</td>
                <td>{p.nome}</td>
                <td>{p.categoria}</td>
                <td>R$ {Number(p.preco_unitario).toFixed(2)}</td>
                <td style={{ color: p.quantidade_disponivel <= p.quantidade_minima ? '#ef4444' : 'inherit', fontWeight: p.quantidade_disponivel <= p.quantidade_minima ? 'bold' : 'normal' }}>
                  {p.quantidade_disponivel}
                </td>
                <td>{p.quantidade_minima}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}