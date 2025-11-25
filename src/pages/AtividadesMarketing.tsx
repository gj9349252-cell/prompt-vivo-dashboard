import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
          const data = monthlyData[month] || { success: 0, partial: 0, rollback: 0, canceled: 0, notExecuted: 0, total: 0 };
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
    marketingStats,
    marketingActivities
  } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredActivities = useMemo(() => {
    if (!startDate && !endDate) return marketingActivities;

    return marketingActivities.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = activityDate.split('/');
      const activityFullDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (startDate && activityFullDate < startDate) return false;
      if (endDate && activityFullDate > endDate) return false;
      return true;
    });
  }, [marketingActivities, startDate, endDate]);

  const filteredStats = useMemo(() => {
    // Initialize all 12 months with default values
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const monthlyData: Record<string, any> = {};
    months.forEach(month => {
      monthlyData[month] = { success: 0, partial: 0, rollback: 0, canceled: 0, notExecuted: 0, total: 0 };
    });

    const equipmentCounts: Record<string, number> = {
      'MKT Conteúdos': 0,
      'Freeview': 0,
      'Evento Temporal': 0,
      'Novos Canais': 0,
      'Novas Cidades': 0,
      'Outras Configurações': 0
    };
    const partialActivities: any[] = [];

    filteredActivities.forEach(activity => {
      const month = activity['MÊS'];
      const monthName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][month - 1];
      
      if (!monthlyData[monthName]) {
        monthlyData[monthName] = { success: 0, partial: 0, rollback: 0, canceled: 0, notExecuted: 0, total: 0 };
      }
      
      monthlyData[monthName].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') monthlyData[monthName].success++;
      else if (activity.STATUS === 'REALIZADA PARCIALMENTE') {
        monthlyData[monthName].partial++;
        partialActivities.push(activity);
      }
      else if (activity.STATUS === 'REALIZADO ROLLBACK') monthlyData[monthName].rollback++;
      else if (activity.STATUS === 'CANCELADA') monthlyData[monthName].canceled++;
      else if (activity.STATUS === 'NÃO EXECUTADO') monthlyData[monthName].notExecuted++;

      const equipment = activity['EQUIPAMENTO'];
      if (equipmentCounts.hasOwnProperty(equipment)) {
        equipmentCounts[equipment]++;
      }
    });

    const totalActivities = filteredActivities.length;
    const participacao = marketingActivities.length > 0 ? (totalActivities / marketingActivities.length) * 100 : 0;

    return { monthlyData, equipmentCounts, partialActivities, participacao };
  }, [filteredActivities, marketingActivities]);

  // Prepare chart data
  const chartData = Object.entries(filteredStats.monthlyData).map(([month, data]) => {
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
        {/* Date Filter */}
        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filtrar por Período</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {(startDate || endDate) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setStartDate(undefined); setEndDate(undefined); }}
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          )}
        </Card>

        {/* Equipment Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <EquipmentCard title="MKT Conteúdos" count={filteredStats.equipmentCounts['MKT Conteúdos']} />
          <EquipmentCard title="Freeview" count={filteredStats.equipmentCounts['Freeview']} />
          <EquipmentCard title="Evento Temporal" count={filteredStats.equipmentCounts['Evento Temporal']} />
          <EquipmentCard title="Novos Canais" count={filteredStats.equipmentCounts['Novos Canais']} />
          <EquipmentCard title="Novas Cidades" count={filteredStats.equipmentCounts['Novas Cidades']} />
          <EquipmentCard title="Outras Config." count={filteredStats.equipmentCounts['Outras Configurações']} />
          <EquipmentCard title="Participação" count={`${filteredStats.participacao.toFixed(1)}%`} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Chart - 60% width */}
          <Card className="lg:col-span-3 p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Consolidado Anual - Marketing
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} barGap={0} barCategoryGap={20}>
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
              <Bar yAxisId="left" dataKey="success" stackId="a" fill="#660099" name="Sucesso" stroke="none" strokeWidth={0}>
                <LabelList dataKey="success" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
              </Bar>
              <Bar yAxisId="left" dataKey="partial" stackId="a" fill="#9933CC" name="Parcial" stroke="none" strokeWidth={0}>
                <LabelList dataKey="partial" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
              </Bar>
              <Bar yAxisId="left" dataKey="rollback" stackId="a" fill="#440066" name="Rollback" radius={[8, 8, 0, 0]} stroke="none" strokeWidth={0}>
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
            <MonthlyStatsTable monthlyData={filteredStats.monthlyData} />
          </Card>
        </div>

        {/* Partial Activities Section */}
        {filteredStats.partialActivities.length > 0 && <Card className="p-6 shadow-card">
            <div className="bg-purple-100 -m-6 mb-4 p-3 rounded-t-lg">
              <h2 className="text-lg font-bold text-purple-800">
                Realizada Parcialmente
              </h2>
            </div>
            <div className="space-y-2">
              {filteredStats.partialActivities.map((activity, index) => <div key={index} className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
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