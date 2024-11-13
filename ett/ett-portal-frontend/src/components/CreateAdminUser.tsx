// src/components/CreateAdminUser.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  grupoEmpresarialId: number;
}

const CreateAdminUser: React.FC<Props> = ({ grupoEmpresarialId }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/admin-user', {
        nome,
        email,
        telefone,
        senha,
        grupoEmpresarialId,
      });
      alert('Usuário administrativo cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setTelefone('');
      setSenha('');
    } catch (error) {
      console.error('Erro ao cadastrar usuário administrativo:', error);
      alert('Erro ao cadastrar usuário administrativo.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Cadastro de Usuário Administrativo</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 font-bold mb-2">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          required
        />

        <label className="block text-gray-700 font-bold mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          required
        />

        <label className="block text-gray-700 font-bold mb-2">Telefone:</label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          required
        />

        <label className="block text-gray-700 font-bold mb-2">Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cadastrar Usuário
        </button>
      </form>
    </div>
  );
};

export default CreateAdminUser;
