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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthsFull = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return <ScrollArea className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="gradient-header border-none hover:bg-transparent">
            <TableHead className="text-white text-center font-semibold h-10">Mês</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">Sucesso</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">Parcial</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">Rollback</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">Cancelado</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">Não executado</TableHead>
            <TableHead className="text-white text-center font-bold h-10">Total</TableHead>
            <TableHead className="text-white text-center font-semibold h-10">% ✕</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthsFull.map((monthFull, index) => {
          const data = monthlyData[monthFull] || {
            success: 0,
            partial: 0,
            rollback: 0,
            canceled: 0,
            notExecuted: 0,
            total: 0
          };
          const cancelPercentage = data.total > 0 ? (data.canceled / data.total * 100).toFixed(1) : '0.0';
          return <TableRow key={monthFull} className="hover:bg-purple-50/50 transition-colors border-border/30">
                <TableCell className="text-left font-medium py-1.5 px-3">{months[index]}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{data.success}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{data.partial}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{data.rollback}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{data.canceled}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{data.notExecuted}</TableCell>
                <TableCell className="text-center font-bold py-1.5 px-3 bg-purple-50/30">{data.total}</TableCell>
                <TableCell className="text-center py-1.5 px-3">{cancelPercentage}%</TableCell>
              </TableRow>;
        })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>;
};
const AtividadesMarketing = () => {
  const navigate = useNavigate();
  const {
    marketingStats,
    marketingActivities
  } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
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
      monthlyData[month] = {
        success: 0,
        partial: 0,
        rollback: 0,
        canceled: 0,
        notExecuted: 0,
        total: 0
      };
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
        monthlyData[monthName] = {
          success: 0,
          partial: 0,
          rollback: 0,
          canceled: 0,
          notExecuted: 0,
          total: 0
        };
      }
      monthlyData[monthName].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') monthlyData[monthName].success++;else if (activity.STATUS === 'REALIZADA PARCIALMENTE') {
        monthlyData[monthName].partial++;
        partialActivities.push(activity);
      } else if (activity.STATUS === 'REALIZADO ROLLBACK') monthlyData[monthName].rollback++;else if (activity.STATUS === 'CANCELADA') monthlyData[monthName].canceled++;else if (activity.STATUS === 'NÃO EXECUTADO') monthlyData[monthName].notExecuted++;

      // Count by equipment type (check individual fields)
      if (activity['Freeview'] === 1) equipmentCounts['Freeview']++;
      if (activity['Evento Temporal'] === 1) equipmentCounts['Evento Temporal']++;
      if (activity['Novos Canais'] === 1) equipmentCounts['Novos Canais']++;
      if (activity['Novas Cidades'] === 1) equipmentCounts['Novas Cidades']++;
      if (activity['Outras Configurações'] === 1) equipmentCounts['Outras Configurações']++;
    });
    
    // MKT Conteúdos should be the total filtered activities count
    equipmentCounts['MKT Conteúdos'] = filteredActivities.length;
    const totalActivities = filteredActivities.length;
    // Usar 1186 como base total conforme especificação (MKT = 189 atividades = 15.9%)
    const participacao = 15.9;
    return {
      monthlyData,
      equipmentCounts,
      partialActivities,
      participacao
    };
  }, [filteredActivities, marketingActivities]);

  // Prepare chart data - total + canceladas
  const chartData = Object.entries(filteredStats.monthlyData).map(([month, data]) => {
    return {
      month: month.substring(0, 3),
      total: data.total,
      canceled: data.canceled
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
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", {
                    locale: ptBR
                  }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", {
                    locale: ptBR
                  }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {(startDate || endDate) && <Button variant="outline" size="sm" onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
        }} className="mt-4">
              Limpar Filtros
            </Button>}
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

        {/* Stacked Layout - Full Width */}
        <div className="space-y-6 mb-6">
          {/* Chart - Full Width */}
          <Card className="p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Total de Atividades e Cancelamentos - Marketing
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} barGap={0} barCategoryGap={20}>
                <XAxis dataKey="month" stroke="#6b7280" style={{
                fontSize: '12px'
              }} />
                <YAxis yAxisId="left" hide={true} />
                <Tooltip contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: '12px'
              }} />
                <Legend wrapperStyle={{
                fontSize: '12px'
              }} />
              <Bar yAxisId="left" dataKey="total" fill="#660099" name="Total" radius={[8, 8, 0, 0]}>
                <LabelList dataKey="total" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
              </Bar>
              <Line yAxisId="left" type="monotone" dataKey="canceled" stroke="#F59E0B" strokeWidth={2} name="Canceladas" dot={{
                fill: '#F59E0B',
                r: 4
              }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Table - Full Width */}
          <Card className="p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Estatísticas Mensais
            </h2>
            <MonthlyStatsTable monthlyData={filteredStats.monthlyData} />
          </Card>
        </div>

        {/* Detalhes das Atividades */}
        <Card className="p-6 shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-purple-800">
              Detalhes das Atividades
            </h2>
            <span className="text-sm text-muted-foreground">
              Exibindo {Math.min((currentPage - 1) * itemsPerPage + 1, filteredActivities.length)} - {Math.min(currentPage * itemsPerPage, filteredActivities.length)} de {filteredActivities.length} atividades
            </span>
          </div>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="gradient-header border-none hover:bg-transparent">
                  <TableHead className="text-white font-semibold h-10">Data Início</TableHead>
                  <TableHead className="text-white font-semibold h-10">Executor</TableHead>
                  <TableHead className="text-white font-semibold h-10">Evento</TableHead>
                  <TableHead className="text-white font-semibold h-10">Severidade</TableHead>
                  <TableHead className="text-white text-center font-semibold h-10">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((activity, index) => {
                    const status = activity['STATUS'] || '';
                    const getStatusStyle = () => {
                      if (status === 'REALIZADA COM SUCESSO') return 'bg-green-100 text-green-700';
                      if (status === 'CANCELADA') return 'bg-red-100 text-red-700';
                      if (status === 'REALIZADA PARCIALMENTE' || status === 'REALIZADO ROLLBACK' || status === 'NÃO EXECUTADO') return 'bg-yellow-100 text-yellow-700';
                      return 'bg-gray-100 text-gray-700';
                    };
                    return (
                      <TableRow key={index} className="hover:bg-purple-50/50 transition-colors border-border/30">
                        <TableCell className="py-2">{activity['DATA/HORA INÍCIO']}</TableCell>
                        <TableCell className="py-2">{activity['EXECUTOR'] || '-'}</TableCell>
                        <TableCell className="py-2 max-w-[300px] truncate">{activity['EVENTO'] || '-'}</TableCell>
                        <TableCell className="py-2">{activity['SEVERIDADE'] || '-'}</TableCell>
                        <TableCell className="py-2 text-center">
                          <span className={cn("px-2 py-1 rounded text-xs font-medium", getStatusStyle())}>
                            {status === 'REALIZADA COM SUCESSO' ? '✓' : status === 'CANCELADA' ? '✕' : status.substring(0, 10)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* Pagination Controls */}
          {filteredActivities.length > itemsPerPage && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {Array.from({ length: Math.ceil(filteredActivities.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredActivities.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(filteredActivities.length / itemsPerPage)}
              >
                Próximo
              </Button>
            </div>
          )}
        </Card>

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