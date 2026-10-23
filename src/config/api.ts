const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiUrl) {
  throw new Error('Configure a variável de ambiente VITE_API_URL.');
}

export const API_URL = apiUrl.replace(/\/+$/, '');