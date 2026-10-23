import React, { useState } from 'react';
import { API_URL } from '../../config/api';

interface PLoginProps {
  onLoginSuccess: () => void;
}

export const PLogin: React.FC<PLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Guarda o utilizador/token no localStorage
      localStorage.setItem('@StockManager:usuario', JSON.stringify(data));
      onLoginSuccess();
    } catch (err: any) {
      setErro(err.message || 'Erro ao efetuar login');
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>StockManager Login</h2>

        {erro && (
          <div style={{ backgroundColor: '#ef4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
            {erro}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email / Utilizador</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {carregando ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};