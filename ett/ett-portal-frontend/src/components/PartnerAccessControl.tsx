// src/components/PartnerAccessControl.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface BusinessGroup {
  id: number;
  nome_grupo: string;
  status_acesso: boolean;
}

interface Partner {
  id: number;
  nome_parceiro: string;
  coligada_id: number;
  status_acesso: boolean;
}

const PartnerAccessControl: React.FC = () => {
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [availablePartners, setAvailablePartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchBusinessGroups = async () => {
      const response = await axios.get('http://localhost:5000/api/grupo-empresarial');
      setBusinessGroups(response.data);
    };

    const fetchAvailablePartners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/controle-acesso-parceiros');
        setAvailablePartners(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas parceiras:', error);
      }
    };

    fetchBusinessGroups();
    fetchAvailablePartners();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      const fetchPartners = async () => {
        const response = await axios.get(`http://localhost:5000/api/grupo-empresarial/${selectedGroupId}/partners`);
        setPartners(response.data);
      };
      fetchPartners();
    } else {
      setPartners([]);
    }
  }, [selectedGroupId]);

  const associatePartnerToGroup = async (partnerId: number) => {
    try {
      await axios.post('http://localhost:5000/api/grupo-empresarial/associar', {
        grupo_empresarial_id: selectedGroupId,
        parceiro_id: partnerId,
      });
      setPartners([...partners, availablePartners.find(p => p.id === partnerId)!]);
    } catch (error) {
      console.error('Erro ao associar parceiro ao grupo', error);
      alert('Erro ao associar parceiro ao grupo.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Controle de Acesso de Empresas Parceiras</h2>

      <label>Selecionar Grupo Empresarial:</label>
      <select
        value={selectedGroupId ?? ''}
        onChange={(e) => setSelectedGroupId(Number(e.target.value))}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Selecione um grupo</option>
        {businessGroups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.nome_grupo}
          </option>
        ))}
      </select>

      <h3 className="text-lg font-semibold">Empresas no Grupo</h3>
      <table className="w-full text-left mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Nome da Empresa</th>
            <th className="border-b p-2">Status de Acesso</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td className="border-b p-2">{partner.nome_parceiro}</td>
              <td className="border-b p-2">{partner.status_acesso ? 'Ativo' : 'Desativado'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mt-6">Associar Nova Empresa ao Grupo</h3>
      <ul className="mt-2">
        {availablePartners
          .filter((partner) => !partners.some((p) => p.id === partner.id))
          .map((partner) => (
            <li key={partner.id} className="flex items-center justify-between mb-2">
              <span>{partner.nome_parceiro}</span>
              <button
                onClick={() => associatePartnerToGroup(partner.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Associar
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PartnerAccessControl;
