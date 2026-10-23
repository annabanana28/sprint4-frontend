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
  const [carregando, setCarregando] = useState(true);

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
    setCarregando(true);
    try {
      const [movsRes, prodsRes] = await Promise.allSettled([
        MovimentacaoRequests.listarTodas(),
        ProdutoRequests.listarTodos(),
      ]);

      if (movsRes.status === 'fulfilled') {
        setMovimentacoes(movsRes.value);
      } else {
        console.error('Erro ao listar movimentações:', movsRes.reason);
      }

      if (prodsRes.status === 'fulfilled') {
        setProdutos(prodsRes.value);
      } else {
        console.error('Erro ao listar produtos para movimentação:', prodsRes.reason);
      }

      if (movsRes.status === 'rejected' && prodsRes.status === 'rejected') {
        exibirMensagem('Não foi possível conectar ao servidor backend.', 'erro');
      }
    } catch {
      exibirMensagem('Erro inesperado ao carregar dados de movimentações.', 'erro');
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

  const iniciarEdicao = (m: MovimentacaoDTO) => {
    if (!m.codigo_movimentacao) return;
    setEditandoId(m.codigo_movimentacao);
    setCodigoProduto(m.produto);
    setTipo(m.tipo);
    setQuantidade(String(m.quantidade));
    setObservacao(m.observacao || '');
    setMotivoRetirada(m.motivo_retirada || '');
    setPrecoUnitario(m.preco_unitario ? String(m.preco_unitario) : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      exibirMensagem('A quantidade deve ser um número inteiro maior que zero!', 'erro');
      return;
    }

    if (tipo === 'RETIRADA' && !motivoRetirada) {
      exibirMensagem('Informe o motivo para movimentação de RETIRADA!', 'erro');
      return;
    }

    let preco: number | undefined = undefined;
    if (precoUnitario.trim()) {
      const precoTratado = precoUnitario.replace(',', '.');
      preco = parseFloat(precoTratado);
      if (isNaN(preco) || preco < 0) {
        exibirMensagem('O preço unitário não pode ser negativo!', 'erro');
        return;
      }
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
      exibirMensagem(
        editandoId ? 'Movimentação atualizada com sucesso!' : 'Movimentação registrada com sucesso!',
        'sucesso'
      );
      cancelarEdicao();
      carregarDados();
    } else {
      exibirMensagem('Falha ao salvar movimentação. Verifique os dados.', 'erro');
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Movimentação de Estoque</h1>

      {mensagem && (
        <div className={`alert-box ${tipoMensagem === 'sucesso' ? 'alert-success' : 'alert-error'}`}>
          <span>{mensagem}</span>
        </div>
      )}

      {/* Formulário de Registro/Edição */}
      <section className="card-box">
        <h2 className="card-title">
          <span>{editandoId ? `✏️ Editar Movimentação #${editandoId}` : '➕ Registrar Nova Movimentação'}</span>
          {editandoId !== null && (
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
            <label htmlFor="prodSelect">Produto *</label>
            <select
              id="prodSelect"
              className="custom-input"
              value={codigoProduto}
              onChange={(e) => setCodigoProduto(e.target.value)}
              required
            >
              <option value="">Selecione o Produto</option>
              {produtos.map((p) => (
                <option key={p.codigo_produto} value={p.codigo_produto}>
                  {p.codigo_produto} - {p.nome} (Atual: {p.quantidade_disponivel})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipoSelect">Tipo de Movimentação *</label>
            <select
              id="tipoSelect"
              className="custom-input"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'ENTRADA' | 'RETIRADA')}
            >
              <option value="ENTRADA">🟢 ENTRADA (Adicionar ao estoque)</option>
              <option value="RETIRADA">🔴 RETIRADA (Baixa de estoque)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="qtdInput">Quantidade *</label>
            <input
              id="qtdInput"
              className="custom-input"
              type="number"
              min="1"
              placeholder="Ex: 10"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              required
            />
          </div>

          {tipo === 'RETIRADA' && (
            <div className="form-group">
              <label htmlFor="motivoSelect">Motivo da Retirada *</label>
              <select
                id="motivoSelect"
                className="custom-input"
                value={motivoRetirada}
                onChange={(e) => setMotivoRetirada(e.target.value)}
                required
              >
                <option value="">Selecione o Motivo</option>
                {motivosValidos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="precoInput">Preço Unitário (R$ - Opcional)</label>
            <input
              id="precoInput"
              className="custom-input"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 49.90"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
            />
          </div>

          <div className="form-group form-full">
            <label htmlFor="obsInput">Observação (Opcional)</label>
            <input
              id="obsInput"
              className="custom-input"
              type="text"
              placeholder="Ex: Nota fiscal 1234, reposição mensal, defeito de fábrica..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          <div className="form-full form-actions">
            <button type="submit" className="btn-accent">
              {editandoId ? '💾 Salvar Alterações' : '➕ Registrar Movimentação'}
            </button>
            {editandoId !== null && (
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

      {/* Histórico */}
      <section className="card-box">
        <h2 className="card-title">
          <span>📜 Histórico de Movimentações ({movimentacoes.length})</span>
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
                <th>Data</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Motivo</th>
                <th>Total</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Carregando histórico...
                  </td>
                </tr>
              ) : movimentacoes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    Nenhuma movimentação registrada até o momento.
                  </td>
                </tr>
              ) : (
                movimentacoes.map((m) => {
                  const dataFormatada = m.data
                    ? new Date(m.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-';

                  const totalFormatado = m.valor_total
                    ? Number(m.valor_total).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : '-';

                  return (
                    <tr key={m.codigo_movimentacao}>
                      <td>
                        <strong>#{m.codigo_movimentacao}</strong>
                      </td>
                      <td style={{ fontSize: '13px', color: '#94a3b8' }}>{dataFormatada}</td>
                      <td>
                        <strong>{m.produto}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            m.tipo === 'ENTRADA' ? 'badge-entrada' : 'badge-retirada'
                          }`}
                        >
                          {m.tipo}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{m.quantidade}</td>
                      <td>{m.motivo_retirada || <span style={{ color: '#64748b' }}>-</span>}</td>
                      <td>{totalFormatado}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-accent btn-sm"
                          onClick={() => iniciarEdicao(m)}
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