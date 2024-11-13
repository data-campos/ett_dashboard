// src/components/CreateBusinessGroup.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface BusinessGroup {
  id: number;
  nome_grupo: string;
  status_acesso: boolean;
}

const CreateBusinessGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Carrega a lista de grupos empresariais
  useEffect(() => {
    fetchBusinessGroups();
  }, []);

  const fetchBusinessGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grupo-empresarial');
      setBusinessGroups(response.data);
    } catch (error) {
      console.error('Erro ao listar grupos empresariais:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/grupo-empresarial', { nome_grupo: groupName });
      setModalMessage('Grupo adicionado com sucesso!');
      setIsModalOpen(true);
      setGroupName('');
      fetchBusinessGroups(); // Atualiza a lista de grupos empresariais
    } catch (error) {
      console.error('Erro ao criar grupo empresarial:', error);
      setModalMessage('Erro ao adicionar o grupo.');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Grupo Empresarial</h2>
      
      <input
        type="text"
        className="border rounded p-2 w-full mb-4"
        placeholder="Nome do Grupo Empresarial"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      
      <button
        onClick={handleCreateGroup}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Adicionar Grupo
      </button>

      {/* Modal de confirmação */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-md w-1/3 mx-auto mt-10 text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-lg font-semibold mb-4">{modalMessage}</h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fechar
        </button>
      </Modal>

      <h3 className="text-lg font-semibold mt-8">Grupos Empresariais Existentes</h3>
      <ul className="mt-4 space-y-2">
        {businessGroups.map((group) => (
          <li key={group.id} className="border rounded p-2">
            {group.nome_grupo} - {group.status_acesso ? 'Ativo' : 'Inativo'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateBusinessGroup;
