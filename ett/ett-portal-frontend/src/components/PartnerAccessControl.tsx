// src/components/PartnerAccessControl.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Partner {
  id: number;
  nome_parceiro: string;
  status_acesso: boolean;
  grupo_empresarial?: string; // Novo campo opcional para o nome do grupo empresarial, se houver
}

const PartnerAccessControl: React.FC<{ coligadaId?: number }> = ({ coligadaId }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const url = coligadaId 
          ? `http://localhost:5000/api/partner-access/${coligadaId}` 
          : 'http://localhost:5000/api/partner-access';
          
        const response = await axios.get(url);
        setPartners(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas parceiras:', error);
        alert('Erro ao carregar empresas parceiras.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [coligadaId]);

  const toggleAccess = async (partnerId: number, accessStatus: boolean) => {
    try {
      await axios.post('http://localhost:5000/api/partner-access/update', {
        partnerId,
        accessStatus: !accessStatus,
      });
      setPartners((prevPartners) =>
        prevPartners.map((partner) =>
          partner.id === partnerId ? { ...partner, status_acesso: !accessStatus } : partner
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status de acesso:', error);
      alert('Erro ao atualizar status de acesso.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Controle de Acesso de Empresas Parceiras</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="border-b p-2">Nome da Empresa</th>
              <th className="border-b p-2">Grupo Empresarial</th>
              <th className="border-b p-2">Status de Acesso</th>
              <th className="border-b p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td className="border-b p-2">{partner.nome_parceiro}</td>
                <td className="border-b p-2">{partner.grupo_empresarial || 'Nenhum'}</td>
                <td className="border-b p-2">{partner.status_acesso ? 'Ativo' : 'Desativado'}</td>
                <td className="border-b p-2">
                  <button
                    className={`px-4 py-2 rounded ${partner.status_acesso ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    onClick={() => toggleAccess(partner.id, partner.status_acesso)}
                  >
                    {partner.status_acesso ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PartnerAccessControl;
