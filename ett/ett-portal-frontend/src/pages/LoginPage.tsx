import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/auth/request-code', { email, phone });
      localStorage.setItem('email', email);
      localStorage.setItem('rememberLogin', rememberLogin.toString());
      navigate('/verify');
    } catch (error) {
      console.error('Erro ao solicitar código', error);
      alert('Erro ao solicitar código. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Telefone"
          className="border p-2 mb-4 w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={rememberLogin}
            onChange={(e) => setRememberLogin(e.target.checked)}
          />
          Lembrar login
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Enviar Código
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
