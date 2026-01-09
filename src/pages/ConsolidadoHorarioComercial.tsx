import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

const ConsolidadoHorarioComercial = () => {
  const navigate = useNavigate();
  const { horarioComercialStats, horarioComercialActivities } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const { 
    total, 
    successCount, 
    partialCount, 
    rollbackCount, 
    canceledCount, 
    notExecutedCount,
    monthlyStats: originalMonthlyStats 
  } = horarioComercialStats;

  // Participação fixa conforme especificação (Horário Comercial = 4.0%)
  const participacao = '4.0';

  // Calculate monthly data for table format
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

    // Map originalMonthlyStats to the format needed
    originalMonthlyStats.forEach((stat: any) => {
      const monthIndex = parseInt(stat.monthName?.replace(/[^0-9]/g, '')) || 0;
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      // Find month by short name
      const shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const idx = shortMonths.findIndex(m => stat.monthName?.startsWith(m));
      
      if (idx >= 0) {
        monthlyData[monthNames[idx]] = {
          success: stat.success || 0,
          partial: stat.partial || 0,
          rollback: stat.rollback || 0,
          canceled: stat.canceled || 0,
          notExecuted: stat.notExecuted || 0,
          total: stat.total || 0
        };
      }
    });

    return { monthlyData };
  }, [originalMonthlyStats]);

  // Prepare chart data
  const chartData = Object.entries(filteredStats.monthlyData).map(([month, data]) => {
    return {
      month: month.substring(0, 3),
      total: data.total,
      canceled: data.canceled
    };
  });

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
                Portal Atividades Programadas – (HORÁRIO COMERCIAL)
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

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <EquipmentCard title="Horário Comercial" count={total} />
          <EquipmentCard title="Sucesso" count={successCount} />
          <EquipmentCard title="Parcial" count={partialCount} />
          <EquipmentCard title="Rollback" count={rollbackCount} />
          <EquipmentCard title="Cancelados" count={canceledCount} />
          <EquipmentCard title="Não Exec" count={notExecutedCount} />
          <EquipmentCard title="Participação" count={`${participacao}%`} />
        </div>

        {/* Stacked Layout - Full Width */}
        <div className="space-y-6 mb-6">
          {/* Chart - Full Width */}
          <Card className="p-6 shadow-card">
            <h2 className="text-lg font-bold text-purple-800 mb-4">
              Total de Atividades e Cancelamentos - Horário Comercial
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

        {/* Explanatory Text */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              As atividades executadas em horário comercial têm por características ajustes no MIB e SDP, 
              exigindo maior coordenação com as equipes de operação e suporte. Essas atividades geralmente 
              envolvem mudanças de configuração que podem impactar o serviço durante o período de maior 
              utilização pelos usuários finais, necessitando planejamento criterioso e comunicação adequada.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConsolidadoHorarioComercial;