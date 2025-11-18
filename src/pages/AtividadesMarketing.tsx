import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Live Clock Component
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="text-right">
      <div className="text-sm font-semibold text-white">
        {format(time, "dd/MM/yy HH:mm", {
        locale: ptBR
      })}
      </div>
    </div>;
};

// Equipment Card Component
const EquipmentCard = ({
  title,
  count
}: {
  title: string;
  count: number | string;
}) => {
  return <Card className="p-4 bg-white border-primary/20 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-primary">{count}</p>
      </div>
    </Card>;
};

// Monthly Stats Table Component
const MonthlyStatsTable = ({
  monthlyData
}: {
  monthlyData: Record<string, any>;
}) => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="gradient-header text-white">
            <th className="py-2 px-2 text-center font-semibold border border-primary">Mês</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Sucesso</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Parcial</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Rollback</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Cancelado</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Não Exec.</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">Total</th>
            <th className="py-2 px-2 text-center font-semibold border border-primary">% Cancel.</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month, index) => {
          const data = monthlyData[month];
          const cancelPercentage = data.total > 0 ? (data.canceled / data.total * 100).toFixed(1) : '0.0';
          return <tr key={month} className={index % 2 === 0 ? 'bg-primary/5' : 'bg-white'}>
                <td className="py-2 px-2 text-left font-medium border border-border">{month}</td>
                <td className="py-2 px-2 text-center border border-border">{data.success}</td>
                <td className="py-2 px-2 text-center border border-border">{data.partial}</td>
                <td className="py-2 px-2 text-center border border-border">{data.rollback}</td>
                <td className="py-2 px-2 text-center border border-border">{data.canceled}</td>
                <td className="py-2 px-2 text-center border border-border">{data.notExecuted}</td>
                <td className="py-2 px-2 text-center font-bold border border-border">{data.total}</td>
                <td className="py-2 px-2 text-center border border-border">{cancelPercentage}%</td>
              </tr>;
        })}
        </tbody>
      </table>
    </div>;
};
const AtividadesMarketing = () => {
  const navigate = useNavigate();
  const {
    marketingStats
  } = useActivitiesData();

  // Prepare chart data
  const chartData = Object.entries(marketingStats.monthlyData).map(([month, data]) => {
    const cancelPercentage = data.total > 0 ? parseFloat((data.canceled / data.total * 100).toFixed(1)) : 0;
    return {
      month: month.substring(0, 3),
      // Abreviar nome do mês
      success: data.success,
      partial: data.partial,
      rollback: data.rollback,
      cancelPercentage
    };
  });
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white">
      {/* Main Header */}
      <header className="gradient-header text-white py-4 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">
                Portal Atividades Programadas – (MKT CONTEÚDOS)
              </h1>
            </div>
            <LiveClock />
          </div>
        </div>
      </header>

      {/* Subtitle Bar */}
      <div className="bg-purple-500 text-white py-2 px-6">
        <div className="container mx-auto">
          
        </div>
      </div>

      <main className="container mx-auto px-6 py-6">
        {/* Equipment Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <EquipmentCard title="MKT Conteúdos" count={marketingStats.equipmentCounts['MKT Conteúdos']} />
          <EquipmentCard title="Freeview" count={marketingStats.equipmentCounts['Freeview']} />
          <EquipmentCard title="Evento Temporal" count={marketingStats.equipmentCounts['Evento Temporal']} />
          <EquipmentCard title="Novos Canais" count={marketingStats.equipmentCounts['Novos Canais']} />
          <EquipmentCard title="Novas Cidades" count={marketingStats.equipmentCounts['Novas Cidades']} />
          <EquipmentCard title="Outras Config." count={marketingStats.equipmentCounts['Outras Configurações']} />
          <EquipmentCard title="Participação" count={`${marketingStats.participacao.toFixed(1)}%`} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Chart - 60% width */}
          <Card className="lg:col-span-3 p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Consolidado Anual - Marketing
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <XAxis dataKey="month" stroke="#6b7280" style={{
                fontSize: '12px'
              }} />
                <YAxis yAxisId="left" hide={true} />
                <YAxis yAxisId="right" orientation="right" hide={true} domain={[0, 100]} />
                <Tooltip contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: '12px'
              }} />
                <Legend wrapperStyle={{
                fontSize: '12px'
              }} />
                <Bar yAxisId="left" dataKey="success" stackId="a" fill="#660099" name="Sucesso" radius={[0, 0, 0, 0]}>
                  <LabelList dataKey="success" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
                </Bar>
                <Bar yAxisId="left" dataKey="partial" stackId="a" fill="#9933CC" name="Parcial" radius={[0, 0, 0, 0]}>
                  <LabelList dataKey="partial" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
                </Bar>
                <Bar yAxisId="left" dataKey="rollback" stackId="a" fill="#440066" name="Rollback" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="rollback" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cancelPercentage" stroke="#F97316" strokeWidth={2} name="% Cancelamento" dot={{
                fill: '#F97316',
                r: 4
              }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Table - 40% width */}
          <Card className="lg:col-span-2 p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Estatísticas Mensais
            </h2>
            <MonthlyStatsTable monthlyData={marketingStats.monthlyData} />
          </Card>
        </div>

        {/* Partial Activities Section */}
        {marketingStats.partialActivities.length > 0 && <Card className="p-6 shadow-card">
            <div className="bg-purple-100 -m-6 mb-4 p-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-purple-800">
                Realizada Parcialmente
              </h2>
            </div>
            <div className="space-y-2">
              {marketingStats.partialActivities.map((activity, index) => <div key={index} className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                  <p className="text-sm">
                    <span className="font-semibold text-purple-700">
                      TP {activity['TP \nSIGITM']}
                    </span>
                    {' - '}
                    <span className="text-foreground">
                      {activity['EVENTO']}
                    </span>
                  </p>
                </div>)}
            </div>
          </Card>}
      </main>
    </div>;
};
export default AtividadesMarketing;