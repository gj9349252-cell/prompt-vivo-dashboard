import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { ArrowLeft, Filter, CalendarIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart, LabelList } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
const TasksFrontOffice = () => {
  const {
    tasksStats,
    data
  } = useActivitiesData();
  const [filterType, setFilterType] = useState<"all" | "tasks" | "workorders">("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const navigate = useNavigate();

  // Filtrar atividades baseado na seleção e datas
  const filteredActivities = useMemo(() => {
    // Para "Todos" (all), usar TODAS as atividades globais
    let activities = filterType === "tasks" ? tasksStats.tasks : 
                     filterType === "workorders" ? tasksStats.workOrders : 
                     data; // Dados globais para aba "Todos"

    if (!startDate && !endDate) return activities;

    return activities.filter(activity => {
      const activityDateStr = activity['DATA/HORA INÍCIO'];
      if (!activityDateStr) return false;
      
      const dateOnlyStr = activityDateStr.split(' ')[0];
      const [day, month, year] = dateOnlyStr.split('/');
      const activityFullDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      activityFullDate.setHours(0, 0, 0, 0);
      
      const normalizedStartDate = startDate ? new Date(startDate) : null;
      if (normalizedStartDate) normalizedStartDate.setHours(0, 0, 0, 0);
      
      const normalizedEndDate = endDate ? new Date(endDate) : null;
      if (normalizedEndDate) normalizedEndDate.setHours(0, 0, 0, 0);

      // Exact date match if both dates are equal
      if (normalizedStartDate && normalizedEndDate && 
          normalizedStartDate.getTime() === normalizedEndDate.getTime()) {
        return activityFullDate.getTime() === normalizedStartDate.getTime();
      }

      if (normalizedStartDate && activityFullDate < normalizedStartDate) return false;
      if (normalizedEndDate && activityFullDate > normalizedEndDate) return false;
      return true;
    });
  }, [filterType, tasksStats, data, startDate, endDate]);

  // Calcular KPIs baseados no filtro ativo
  const filteredKPIs = useMemo(() => {
    // Para aba "Todos", usar valores globais fixos
    if (filterType === "all") {
      return {
        total: 878,
        success: 755,
        partial: 12,
        canceled: 78,
        woExecuted: filteredActivities.filter(a => a.STATUS === 'WO EXECUTADA SEM TP').length
      };
    }
    
    // Para TASKs e Work Orders, calcular dinamicamente
    return {
      total: filteredActivities.length,
      success: filteredActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length,
      partial: filteredActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length,
      canceled: filteredActivities.filter(a => a.STATUS === 'CANCELADA').length,
      woExecuted: filteredActivities.filter(a => a.STATUS === 'WO EXECUTADA SEM TP').length
    };
  }, [filteredActivities, filterType]);

  // Calcular dados mensais baseados no filtro ativo
  const filteredMonthlyData = useMemo(() => {
    // Para aba "Todos", usar dados fixos especificados pelo usuário
    if (filterType === "all") {
      return [
        { month: 'Janeiro', success: 72, partial: 1, rollback: 0, canceled: 8, canceledPercent: 10, notExecuted: 0, totalExecuted: 73 },
        { month: 'Fevereiro', success: 65, partial: 2, rollback: 0, canceled: 12, canceledPercent: 14, notExecuted: 5, totalExecuted: 67 },
        { month: 'Março', success: 96, partial: 6, rollback: 0, canceled: 10, canceledPercent: 9, notExecuted: 4, totalExecuted: 102 },
        { month: 'Abril', success: 41, partial: 1, rollback: 0, canceled: 13, canceledPercent: 23, notExecuted: 2, totalExecuted: 42 },
        { month: 'Maio', success: 78, partial: 0, rollback: 0, canceled: 4, canceledPercent: 5, notExecuted: 4, totalExecuted: 78 },
        { month: 'Junho', success: 71, partial: 1, rollback: 0, canceled: 2, canceledPercent: 3, notExecuted: 2, totalExecuted: 72 },
        { month: 'Julho', success: 63, partial: 1, rollback: 0, canceled: 4, canceledPercent: 5, notExecuted: 8, totalExecuted: 64 },
        { month: 'Agosto', success: 26, partial: 0, rollback: 0, canceled: 4, canceledPercent: 13, notExecuted: 2, totalExecuted: 26 },
        { month: 'Setembro', success: 87, partial: 0, rollback: 0, canceled: 11, canceledPercent: 11, notExecuted: 0, totalExecuted: 87 },
        { month: 'Outubro', success: 71, partial: 0, rollback: 0, canceled: 10, canceledPercent: 12, notExecuted: 2, totalExecuted: 71 },
        { month: 'Novembro', success: 85, partial: 0, rollback: 0, canceled: 0, canceledPercent: 0, notExecuted: 0, totalExecuted: 85 },
        { month: 'Dezembro', success: 0, partial: 0, rollback: 0, canceled: 0, canceledPercent: 0, notExecuted: 0, totalExecuted: 0 },
      ];
    }
    
    // Para TASKs e Work Orders, calcular dinamicamente
    const monthMap: Record<string, {
      success: number;
      partial: number;
      canceled: number;
      total: number;
    }> = {};
    
    filteredActivities.forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
      const key = `${year}-${month.padStart(2, '0')}`;
      
      if (!monthMap[key]) {
        monthMap[key] = {
          success: 0,
          partial: 0,
          canceled: 0,
          total: 0
        };
      }
      
      monthMap[key].total++;
      const status = activity.STATUS;
      if (status === 'REALIZADA COM SUCESSO') monthMap[key].success++;
      else if (status === 'REALIZADA PARCIALMENTE') monthMap[key].partial++;
      else if (status === 'CANCELADA') monthMap[key].canceled++;
    });
    
    return Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([key, stats]) => {
      const [year, month] = key.split('-');
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return {
        month: monthNames[parseInt(month) - 1],
        success: stats.success,
        partial: stats.partial,
        canceled: stats.canceled,
        total: stats.total
      };
    });
  }, [filteredActivities, filterType]);
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="gradient-header text-white p-6 rounded-lg shadow-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">
            PORTAL ATIVIDADES PROGRAMADAS – PLATAFORMA DE TV
          </h1>
          <p className="text-sm mt-2 text-white/80">
            Relógio com data e hora atual
          </p>
          {filterType !== "all" && <p className="text-white/90 text-sm mt-1">
              📊 Visualizando apenas: {filterType === "tasks" ? "TASKs" : "Work Orders"}
            </p>}
        </div>

        {/* Date Filter */}
        <Card className="p-6 shadow-card">
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

        {/* Filter Tabs */}
        <Card className="p-6 shadow-card">
          <Tabs value={filterType} onValueChange={value => setFilterType(value as "all" | "tasks" | "workorders")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Todos (878)
              </TabsTrigger>
              <TabsTrigger value="tasks">
                TASKs (443)
              </TabsTrigger>
              <TabsTrigger value="workorders">
                Work Orders (435)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-card/80 backdrop-blur border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                TOTAL DE ATIVIDADES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary text-center">
                {filteredKPIs.total}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Realizadas com Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 text-center">
                {filteredKPIs.success}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Parcial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600 text-center">
                {filteredKPIs.partial}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Cancelada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600 text-center">
                {filteredKPIs.canceled}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-teal-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                WO Executada sem TP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-600 text-center">
                {filteredKPIs.woExecuted}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              {filterType === "all" ? "Total de Atividades e Cancelamentos - Global" : 
               filterType === "tasks" ? "Total de Atividades e Cancelamentos - TASKs" : 
               "Total de Atividades e Cancelamentos - Work Orders"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={filteredMonthlyData} barGap={0} barCategoryGap={20}>
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" tick={{
                fill: 'hsl(var(--foreground))'
              }} />
                <YAxis yAxisId="left" hide={true} />
                <Tooltip contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey={filterType === "all" ? "totalExecuted" : "total"} 
                  fill="#660099" 
                  name={filterType === "all" ? "Total Executado" : "Total"} 
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList 
                    dataKey={filterType === "all" ? "totalExecuted" : "total"} 
                    position="center" 
                    fill="white" 
                    fontSize={12} 
                    fontWeight="bold" 
                    formatter={(value: number) => value > 0 ? value : ''} 
                  />
                </Bar>
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="canceled" 
                  stroke="#F59E0B" 
                  strokeWidth={2} 
                  name="Canceladas"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-card/80 backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-primary z-10">
                  <TableRow>
                    <TableHead className="text-primary-foreground font-bold"></TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center">Sucesso</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center">Parcial</TableHead>
                    {filterType === "all" && (
                      <>
                        <TableHead className="text-primary-foreground font-bold text-center">Rollback</TableHead>
                        <TableHead className="text-primary-foreground font-bold text-center">% Cancelado</TableHead>
                        <TableHead className="text-primary-foreground font-bold text-center">Não executado</TableHead>
                      </>
                    )}
                    <TableHead className="text-primary-foreground font-bold text-center">Cancelada</TableHead>
                    <TableHead className="text-primary-foreground font-bold text-center">
                      {filterType === "all" ? "Total Executado" : "Total"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMonthlyData.map(month => (
                    <TableRow 
                      key={month.month} 
                      className="cursor-pointer hover:bg-primary/5 transition-colors"
                      onClick={() => navigate(`/detalhes-mes/${month.month}?tipo=${filterType}`)}
                    >
                      <TableCell className="font-semibold text-primary">{month.month}</TableCell>
                      <TableCell className="text-center">{month.success}</TableCell>
                      <TableCell className="text-center">{month.partial}</TableCell>
                      {filterType === "all" && 'rollback' in month && (
                        <>
                          <TableCell className="text-center">{month.rollback}</TableCell>
                          <TableCell className="text-center">{month.canceledPercent}%</TableCell>
                          <TableCell className="text-center">{month.notExecuted}</TableCell>
                        </>
                      )}
                      <TableCell className="text-center">{month.canceled}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {filterType === "all" && 'totalExecuted' in month ? month.totalExecuted : month.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default TasksFrontOffice;