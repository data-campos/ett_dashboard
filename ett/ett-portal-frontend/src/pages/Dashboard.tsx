import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface DashboardProps {
  coligadaId?: number; // Recebe o ID da coligada (0 para geral, 1 para ETT, 6 para FIRST)
}

const Dashboard: React.FC<DashboardProps> = ({ coligadaId }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      console.log("Token utilizado para requisição:", token); // Log do token
      try {
        const response = await axios.get(`http://localhost:5000/api/dashboard${coligadaId ? `/${coligadaId}` : ''}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados do dashboard', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          alert('Acesso negado. Faça login novamente.');
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    };    
    
    
  
    const fetchFuncionarios = async () => {
      const token = localStorage.getItem('token');
      console.log("Token utilizado para funcionários:", token); // Para verificar o token
      try {
        const response = await axios.get(`http://localhost:5000/api/funcionarios/${coligadaId ?? ''}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao obter funcionários', error);
        alert('Erro ao carregar dados dos funcionários.');
      }
    };
  
    fetchDashboardData();
    fetchFuncionarios();
  }, [coligadaId]);
  

  if (!dashboardData || !Array.isArray(dashboardData)) {
    return <p>Carregando dados do dashboard...</p>;
  }

  const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const filteredFuncionarios = funcionarios.filter((funcionario) =>
    funcionario.NOME_FUNCIONARIO.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.NOME_FUNCAO.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funcionario.DESCRICAO_SECAO.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const coligadas = dashboardData.map((item: any) => `Coligada ${item.CODCOLIGADA}`);
  const totalFuncionarios = dashboardData.map((item: any) => item.totalFuncionarios);
  const mediaSalario = dashboardData.map((item: any) => item.mediaSalario);
  const totalMasculino = dashboardData.map((item: any) => item.totalMasculino);
  const totalFeminino = dashboardData.map((item: any) => item.totalFeminino);

  const barData = {
    labels: coligadas,
    datasets: [
      {
        label: 'Total de Funcionários',
        data: totalFuncionarios,
        backgroundColor: '#4B9CD3',
      },
      {
        label: 'Média Salarial',
        data: mediaSalario,
        backgroundColor: '#E87653',
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Corporativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {dashboardData.map((item: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Coligada {item.CODCOLIGADA}</h2>
            <p className="text-gray-600">Total de Funcionários: <span className="font-medium">{formatNumber(item.totalFuncionarios)}</span></p>
            <p className="text-gray-600">Média Salarial: <span className="font-medium">{formatCurrency(item.mediaSalario)}</span></p>
            <p className="text-gray-600">Masculino: <span className="font-medium">{formatNumber(item.totalMasculino)}</span></p>
            <p className="text-gray-600">Feminino: <span className="font-medium">{formatNumber(item.totalFeminino)}</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total de Funcionários e Média Salarial</h2>
          <Bar data={barData} />
        </div>
        {dashboardData.map((item: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribuição de Gênero - Coligada {item.CODCOLIGADA}</h2>
            <Pie
              data={{
                labels: ['Masculino', 'Feminino'],
                datasets: [
                  {
                    data: [item.totalMasculino, item.totalFeminino],
                    backgroundColor: ['#4B9CD3', '#E87653'],
                  },
                ],
              }}
            />
          </div>
        ))}
      </div>

      {/* <input
        type="text"
        placeholder="Buscar por nome, função ou seção"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

     {/* <div className="bg-white p-6 rounded-lg shadow-md overflow-auto hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Detalhes de Funcionários por Coligada</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
              <th className="py-3 px-6 text-left">Coligada</th>
              <th className="py-3 px-6 text-left">Chapa</th>
              <th className="py-3 px-6 text-left">Nome Funcionário</th>
              <th className="py-3 px-6 text-center">Sexo</th>
              <th className="py-3 px-6 text-center">CPF</th>
              <th className="py-3 px-6 text-left">Função</th>
              <th className="py-3 px-6 text-left">Descrição Seção</th>
              <th className="py-3 px-6 text-center">Data Admissão</th>
              <th className="py-3 px-6 text-center">Data Nascimento</th>
              <th className="py-3 px-6 text-center">Evento</th>
              <th className="py-3 px-6 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredFuncionarios.length > 0 ? (
              filteredFuncionarios.map((funcionario: any, i: number) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{funcionario.CODCOLIGADA}</td>
                  <td className="py-3 px-6 text-left">{funcionario.CHAPA}</td>
                  <td className="py-3 px-6 text-left">{funcionario.NOME_FUNCIONARIO}</td>
                  <td className="py-3 px-6 text-center">{funcionario.SEXO}</td>
                  <td className="py-3 px-6 text-center">{funcionario.CPF}</td>
                  <td className="py-3 px-6 text-left">{funcionario.NOME_FUNCAO}</td>
                  <td className="py-3 px-6 text-left">{funcionario.DESCRICAO_SECAO}</td>
                  <td className="py-3 px-6 text-center">{new Date(funcionario.DATAADMISSAO).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">{new Date(funcionario.DTNASCIMENTO).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">{funcionario.EVENTO}</td>
                  <td className="py-3 px-6 text-right">R$ {funcionario.VALOR.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-3 px-6 text-center">Nenhum funcionário encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default Dashboard;
