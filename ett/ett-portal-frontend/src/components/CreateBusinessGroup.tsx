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
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [groupName, setGroupName] = useState('');
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false); // Novo estado para modal de sucesso
  
  // Configurações do modal para acessibilidade
  Modal.setAppElement('#root');
  
  // Fetch groups on component mount
  useEffect(() => {
    fetchBusinessGroups();
  }, []);

  const fetchBusinessGroups = async () => {
    const response = await axios.get('http://localhost:5000/api/grupo-empresarial');
    setBusinessGroups(response.data);
  };

  const handleAddOrEditGroup = async () => {
    try {
      if (editGroupId) {
        // Edit group
        await axios.put(`http://localhost:5000/api/grupo-empresarial/${editGroupId}`, {
          nome_grupo: groupName
        });
        setEditGroupId(null);
      } else {
        // Add new group
        await axios.post('http://localhost:5000/api/grupo-empresarial', {
          nome_grupo: groupName
        });
      }
      
      setGroupName('');
      fetchBusinessGroups();

      // Abre o modal de sucesso
      setSuccessModalIsOpen(true);

      // Fecha o modal de sucesso automaticamente após 2 segundos
      setTimeout(() => setSuccessModalIsOpen(false), 2000);
    } catch (error) {
      console.error("Erro ao adicionar ou editar o grupo empresarial:", error);
    }
  };

  const handleEditClick = (group: BusinessGroup) => {
    setEditGroupId(group.id);
    setGroupName(group.nome_grupo);
  };

  const handleDeleteClick = async (groupId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      await axios.delete(`http://localhost:5000/api/grupo-empresarial/${groupId}`);
      fetchBusinessGroups();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Cadastrar Grupo Empresarial</h2>
      <input
        type="text"
        placeholder="Nome do grupo"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <button
        onClick={handleAddOrEditGroup}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {editGroupId ? 'Salvar Alterações' : 'Adicionar Grupo'}
      </button>

      <h3 className="text-lg font-semibold mt-6">Grupos Empresariais</h3>
      <ul className="mt-4">
        {businessGroups.map((group) => (
          <li key={group.id} className="flex items-center justify-between mb-2">
            <span>{group.nome_grupo}</span>
            <div>
              <button
                onClick={() => handleEditClick(group)}
                className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded"
              >
                Editar
              </button>
              {/*<button
                onClick={() => handleDeleteClick(group.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Excluir
              </button>*/}
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de confirmação de sucesso */}
      <Modal
        isOpen={successModalIsOpen}
        onRequestClose={() => setSuccessModalIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h2 className="text-lg font-semibold mb-4">Sucesso!</h2>
          <p>{editGroupId ? 'Grupo empresarial editado com sucesso!' : 'Grupo empresarial adicionado com sucesso!'}</p>
          <button
            onClick={() => setSuccessModalIsOpen(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateBusinessGroup;
