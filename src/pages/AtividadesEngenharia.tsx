import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const AtividadesEngenharia = () => {
  const navigate = useNavigate();
  const { engineeringActivities, totalActivities } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const filteredActivities = useMemo(() => {
    if (!startDate && !endDate) return engineeringActivities;
    
    return engineeringActivities.filter(activity => {
      const dateStr = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = dateStr.split('/').map(Number);
      const activityDate = new Date(year, month - 1, day);
      if (startDate && activityDate < startDate) return false;
      if (endDate && activityDate > endDate) return false;
      return true;
    });
  }, [engineeringActivities, startDate, endDate]);

  // Calculate category counts
  const categoryStats = useMemo(() => {
    const total = filteredActivities.length;
    const vsa = filteredActivities.filter(a => a.VSA === 1).length;
    const rws = filteredActivities.filter(a => a.RWs === 1).length;
    const rdv = filteredActivities.filter(a => a.RDV === 1).length;
    const scdn = filteredActivities.filter(a => a.SCDN === 1).length;
    const outrasConfig = filteredActivities.filter(a => a['Outras Configurações'] === 1).length;
    // Participação fixa conforme especificação (Engenharia = 8.77%)
    const participacao = 8.77;
    
    return { total, vsa, rws, rdv, scdn, outrasConfig, participacao };
  }, [filteredActivities]);

  // Calculate monthly data for table
  const filteredStats = useMemo(() => {
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

    filteredActivities.forEach(activity => {
      const month = activity['MÊS'];
      const monthName = months[month - 1];
      if (!monthlyData[monthName]) return;
      
      monthlyData[monthName].total++;
      const status = activity.STATUS?.toUpperCase() || '';
      
      if (status.includes('SUCESSO')) monthlyData[monthName].success++;
      else if (status.includes('PARCIAL')) monthlyData[monthName].partial++;
      else if (status.includes('ROLLBACK')) monthlyData[monthName].rollback++;
      else if (status.includes('CANCELAD')) monthlyData[monthName].canceled++;
      else if (status.includes('NÃO EXECUTAD')) monthlyData[monthName].notExecuted++;
    });

    return { monthlyData };
  }, [filteredActivities]);

  // Prepare chart data
  const chartData = Object.entries(filteredStats.monthlyData).map(([month, data]) => {
    return {
      month: month.substring(0, 3),
      total: data.total,
      canceled: data.canceled
    };
  });

  // Get rollback activities
  const rollbackActivities = useMemo(() => {
    return filteredActivities.filter(a => 
      a.STATUS?.toUpperCase().includes('ROLLBACK')
    );
  }, [filteredActivities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white">
      {/* Main Header */}
      <header className="gradient-header text-white py-4 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">
                Portal Atividades Programadas – (ENGENHARIA)
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
                    {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione a data"}
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
                    {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data"}
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
          <EquipmentCard title="Engenharia TV" count={categoryStats.total} />
          <EquipmentCard title="VSA" count={categoryStats.vsa} />
          <EquipmentCard title="RWs" count={categoryStats.rws} />
          <EquipmentCard title="RDV" count={categoryStats.rdv} />
          <EquipmentCard title="SCDN" count={categoryStats.scdn} />
          <EquipmentCard title="Outras Config." count={categoryStats.outrasConfig} />
          <EquipmentCard title="Participação" count={`${categoryStats.participacao.toFixed(2)}%`} />
        </div>

        {/* Stacked Layout - Full Width */}
        <div className="space-y-6 mb-6">
          {/* Chart - Full Width */}
          <Card className="p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Total de Atividades e Cancelamentos - Engenharia
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} barGap={0} barCategoryGap={20}>
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" hide={true} />
                <Tooltip contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: '12px'
                }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="total" fill="#660099" name="Total" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="total" position="center" fill="white" fontSize={12} fontWeight="bold" formatter={(value: number) => value > 0 ? value : ''} />
                </Bar>
                <Line yAxisId="left" type="monotone" dataKey="canceled" stroke="#F59E0B" strokeWidth={2} name="Canceladas" dot={{ fill: '#F59E0B', r: 4 }} />
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

        {/* Rollback Activities Section */}
        {rollbackActivities.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Atividades Rollback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rollbackActivities.map((activity, index) => (
                  <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          TP {activity['TP \nSIGITM']} - {activity.EVENTO}
                        </p>
                        <div className="mt-2 flex gap-4 text-xs text-gray-600">
                          <span>Data: {activity['DATA/HORA INÍCIO']}</span>
                          <span>Executor: {activity['Executor da Atividade']}</span>
                          <span>Severidade: {activity.SEVERIDADE}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Rollback
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detalhes das Atividades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detalhes das Atividades</CardTitle>
            <div className="text-sm text-muted-foreground">
              Exibindo {Math.min((currentPage - 1) * itemsPerPage + 1, filteredActivities.length)} - {Math.min(currentPage * itemsPerPage, filteredActivities.length)} de {filteredActivities.length} atividades
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Data Início</th>
                    <th className="text-left py-2 px-4">Executor</th>
                    <th className="text-left py-2 px-4">Evento</th>
                    <th className="text-left py-2 px-4">Severidade</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((activity, index) => {
                      const status = activity.STATUS?.toUpperCase() || '';
                      const getStatusColor = () => {
                        if (status.includes('SUCESSO')) return 'bg-green-100 text-green-700';
                        if (status.includes('CANCELAD')) return 'bg-red-100 text-red-700';
                        if (status.includes('PARCIAL') || status.includes('ROLLBACK') || status.includes('NÃO EXECUTAD')) 
                          return 'bg-yellow-100 text-yellow-700';
                        return 'bg-gray-100 text-gray-700';
                      };

                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{activity['DATA/HORA INÍCIO']}</td>
                          <td className="py-2 px-4">{activity['Executor da Atividade'] || '-'}</td>
                          <td className="py-2 px-4 max-w-md truncate">{activity.EVENTO}</td>
                          <td className="py-2 px-4">{activity.SEVERIDADE}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
                              {activity.STATUS}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredActivities.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.ceil(filteredActivities.length / itemsPerPage) }, (_, i) => i + 1)
                    .filter(page => {
                      const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 2) return true;
                      return false;
                    })
                    .map((page, idx, arr) => (
                      <span key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-1">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      </span>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredActivities.length / itemsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredActivities.length / itemsPerPage)}
                >
                  Próxima
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AtividadesEngenharia;