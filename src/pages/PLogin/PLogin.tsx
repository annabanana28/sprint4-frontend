import React, { useState } from 'react';
import { API_URL } from '../../config/api';

interface PLoginProps {
  onLoginSuccess: () => void;
}

export const PLogin: React.FC<PLoginProps> = ({ onLoginSuccess }) => {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setCarregando(true);

    const endpoint = modoCadastro ? `${API_URL}/usuarios` : `${API_URL}/usuarios/login`;
    const payload = modoCadastro ? { nome, login, senha } : { login, senha };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || data.erro || 'Erro ao processar requisição');
      }

      if (modoCadastro) {
        setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login abaixo.' });
        setModoCadastro(false);
      } else {
        localStorage.setItem('@StockManager:usuario', JSON.stringify(data));
        onLoginSuccess();
      }
    } catch (err: any) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao comunicar com o servidor' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#1e293b',
        padding: '30px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {modoCadastro ? 'Criar Conta' : 'StockManager Login'}
        </h2>

        {mensagem && (
          <div style={{
            backgroundColor: mensagem.tipo === 'erro' ? '#ef4444' : '#22c55e',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {mensagem.texto}
          </div>
        )}

        {modoCadastro && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #334155',
                backgroundColor: '#0f172a',
                color: '#fff',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Login / Utilizador</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Palavra-passe</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {carregando ? 'A aguardar...' : (modoCadastro ? 'Cadastrar' : 'Entrar')}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setMensagem(null);
          }}
          style={{
            width: '100%',
            marginTop: '10px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
      </form>
    </div>
  );
};