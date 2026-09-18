import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { MovimentacaoDTO } from '../../dto/MovimentacaoDTO';
import type { ProdutoDTO } from '../../dto/ProdutoDTO';
import { MovimentacaoRequests } from '../../fetch/MovimentacaoRequests';
import { ProdutoRequests } from '../../fetch/ProdutoRequests';

export function PMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDTO[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [codigoProduto, setCodigoProduto] = useState('');
  const [tipo, setTipo] = useState<'ENTRADA' | 'RETIRADA'>('ENTRADA');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [motivoRetirada, setMotivoRetirada] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');

  const motivosValidos = ['VENDA', 'USO INTERNO', 'PERDA', 'PRODUTO DANIFICADO', 'CORREÇÃO'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [movs, prods] = await Promise.all([
        MovimentacaoRequests.listarTodas(),
        ProdutoRequests.listarTodos(),
      ]);
      setMovimentacoes(movs);
      setProdutos(prods);
    } catch {
      exibirMensagem('Erro ao carregar histórico de movimentações.', 'erro');
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

  const iniciarEdicao = (m: MovimentacaoDTO) => {
    if (!m.codigo_movimentacao) return;
    setEditandoId(m.codigo_movimentacao);
    setCodigoProduto(m.produto);
    setTipo(m.tipo);
    setQuantidade(String(m.quantidade));
    setObservacao(m.observacao || '');
    setMotivoRetirada(m.motivo_retirada || '');
    setPrecoUnitario(m.preco_unitario ? String(m.preco_unitario) : '');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setCodigoProduto('');
    setTipo('ENTRADA');
    setQuantidade('');
    setObservacao('');
    setMotivoRetirada('');
    setPrecoUnitario('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!codigoProduto) {
      exibirMensagem('Selecione um produto!', 'erro');
      return;
    }

    const qtd = parseInt(quantidade);
    if (isNaN(qtd) || qtd <= 0) {
      exibirMensagem('A quantidade deve ser maior que zero!', 'erro');
      return;
    }

    if (tipo === 'RETIRADA' && !motivoRetirada) {
      exibirMensagem('Informe o motivo para movimentação de RETIRADA!', 'erro');
      return;
    }

    const preco = precoUnitario ? parseFloat(precoUnitario) : undefined;
    if (preco !== undefined && (isNaN(preco) || preco < 0)) {
      exibirMensagem('O preço unitário não pode ser negativo!', 'erro');
      return;
    }

    const payload: MovimentacaoDTO = {
      produto: codigoProduto,
      tipo,
      quantidade: qtd,
      observacao: observacao.trim() || undefined,
      motivo_retirada: tipo === 'RETIRADA' ? motivoRetirada : undefined,
      preco_unitario: preco,
    };

    let sucesso = false;
    if (editandoId !== null) {
      sucesso = await MovimentacaoRequests.atualizar(editandoId, payload);
    } else {
      sucesso = await MovimentacaoRequests.cadastrar(payload);
    }

    if (sucesso) {
      exibirMensagem(editandoId ? 'Movimentação atualizada com sucesso!' : 'Movimentação registrada com sucesso!', 'sucesso');
      cancelarEdicao();
      carregarDados();
    } else {
      exibirMensagem('Falha ao salvar movimentação.', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Movimentação de Estoque</h1>

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
        <h2 className="card-title">{editandoId ? `Editar Movimentação #${editandoId}` : 'Registrar Movimentação'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <select
            className="custom-input"
            value={codigoProduto}
            onChange={(e) => setCodigoProduto(e.target.value)}
            required
          >
            <option value="">Selecione o Produto *</option>
            {produtos.map((p) => (
              <option key={p.codigo_produto} value={p.codigo_produto}>
                {p.codigo_produto} - {p.nome}
              </option>
            ))}
          </select>

          <select
            className="custom-input"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'ENTRADA' | 'RETIRADA')}
          >
            <option value="ENTRADA">ENTRADA</option>
            <option value="RETIRADA">RETIRADA</option>
          </select>

          <input
            className="custom-input"
            type="number"
            placeholder="Quantidade *"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />

          {tipo === 'RETIRADA' && (
            <select
              className="custom-input"
              value={motivoRetirada}
              onChange={(e) => setMotivoRetirada(e.target.value)}
              required
            >
              <option value="">Selecione o Motivo da Retirada *</option>
              {motivosValidos.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          )}

          <input
            className="custom-input"
            type="number"
            step="0.01"
            placeholder="Preço Unitário (Opcional)"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
          />

          <input
            className="custom-input"
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-accent">
              {editandoId ? 'Salvar Alterações' : 'Registrar Movimentação'}
            </button>
            {editandoId !== null && (
              <button type="button" className="btn-accent" style={{ background: '#64748b' }} onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card-box">
        <h2 className="card-title">Histórico de Movimentações</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Motivo</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {movimentacoes.map((m) => (
              <tr key={m.codigo_movimentacao}>
                <td>#{m.codigo_movimentacao}</td>
                <td>{m.produto}</td>
                <td style={{ color: m.tipo === 'ENTRADA' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                  {m.tipo}
                </td>
                <td>{m.quantidade}</td>
                <td>{m.motivo_retirada || '-'}</td>
                <td>{m.valor_total ? `R$ ${Number(m.valor_total).toFixed(2)}` : '-'}</td>
                <td>
                  <button className="btn-accent" style={{ padding: '6px 16px', fontSize: '14px' }} onClick={() => iniciarEdicao(m)}>
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