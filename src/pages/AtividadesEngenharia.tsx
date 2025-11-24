import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, CheckCircle, XCircle, Clock, Filter, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AtividadesEngenharia = () => {
  const navigate = useNavigate();
  const { engineeringActivities } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredActivities = useMemo(() => {
    if (!startDate && !endDate) return engineeringActivities;

    return engineeringActivities.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = activityDate.split('/');
      const activityFullDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (startDate && activityFullDate < startDate) return false;
      if (endDate && activityFullDate > endDate) return false;
      return true;
    });
  }, [engineeringActivities, startDate, endDate]);

  const totalActivities = filteredActivities.length;
  const totalSuccess = filteredActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
  const totalRollback = filteredActivities.filter(a => a.STATUS === 'REALIZADO ROLLBACK').length;
  const totalCanceled = filteredActivities.filter(a => a.STATUS === 'CANCELADA').length;
  const totalPartial = filteredActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
  const totalNotExecuted = filteredActivities.filter(a => a.STATUS === 'NÃO EXECUTADO').length;
  const successRate = totalActivities > 0 ? ((totalSuccess / totalActivities) * 100).toFixed(1) : '0';

  // Agrupa por mês
  const monthlyStats = filteredActivities.reduce((acc, activity) => {
    const month = String(activity['MÊS']);
    const year = String(activity['ANO']);
    const key = `${year}-${month.padStart(2, '0')}`;
    
    if (!acc[key]) {
      acc[key] = { success: 0, rollback: 0, canceled: 0, partial: 0, notExecuted: 0, total: 0 };
    }
    
    acc[key].total++;
    if (activity.STATUS === 'REALIZADA COM SUCESSO') {
      acc[key].success++;
    } else if (activity.STATUS === 'REALIZADO ROLLBACK') {
      acc[key].rollback++;
    } else if (activity.STATUS === 'CANCELADA') {
      acc[key].canceled++;
    } else if (activity.STATUS === 'REALIZADA PARCIALMENTE') {
      acc[key].partial++;
    } else if (activity.STATUS === 'NÃO EXECUTADO') {
      acc[key].notExecuted++;
    }
    
    return acc;
  }, {} as Record<string, { success: number; rollback: number; canceled: number; partial: number; notExecuted: number; total: number }>);

  const monthlyData = Object.entries(monthlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, stats]) => {
      const [year, month] = key.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return {
        month: monthNames[parseInt(month) - 1],
        success: stats.success,
        rollback: stats.rollback,
        canceled: stats.canceled,
        partial: stats.partial,
        notExecuted: stats.notExecuted,
        total: stats.total
      };
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white py-6 px-6 shadow-elevated">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">ATIVIDADES ENGENHARIA</h1>
              <p className="text-white/90 text-sm mt-1">Análise completa das atividades da área de Engenharia</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Date Filter */}
        <Card className="p-6 shadow-card mb-8">
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Atividades</p>
                <p className="text-3xl font-bold text-primary">{totalActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Realizadas com Sucesso</p>
                <p className="text-3xl font-bold text-green-600">{totalSuccess}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rollback</p>
                <p className="text-3xl font-bold text-orange-600">{totalRollback}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-3xl font-bold text-red-600">{totalCanceled}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* KPIs - Linha 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parciais</p>
                <p className="text-3xl font-bold text-yellow-600">{totalPartial}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Não Executadas</p>
                <p className="text-3xl font-bold text-gray-600">{totalNotExecuted}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-accent">{successRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Atividades Mensais - Engenharia
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barGap={0} barCategoryGap={20}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="success" fill="#660099" name="Sucesso" stackId="a" stroke="none" strokeWidth={0}>
                <LabelList 
                  dataKey="success" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
              </Bar>
              <Bar dataKey="rollback" fill="#9933CC" name="Rollback" stackId="a" stroke="none" strokeWidth={0}>
                <LabelList 
                  dataKey="rollback" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
              </Bar>
              <Bar dataKey="canceled" fill="#EF4444" name="Canceladas" stackId="a" stroke="none" strokeWidth={0}>
                <LabelList 
                  dataKey="canceled" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
              </Bar>
              <Bar dataKey="partial" fill="#F59E0B" name="Parciais" stackId="a" stroke="none" strokeWidth={0}>
                <LabelList 
                  dataKey="partial" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
              </Bar>
              <Bar dataKey="notExecuted" fill="#6B7280" name="Não Executadas" radius={[8, 8, 0, 0]} stackId="a" stroke="none" strokeWidth={0}>
                <LabelList 
                  dataKey="notExecuted" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activities Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Detalhes das Atividades - Engenharia
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data Início</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Executor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Evento</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Severidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA INÍCIO']}</td>
                    <td className="py-3 px-4 text-foreground">{activity['Executor da Atividade']}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['EVENTO']}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.SEVERIDADE === 'ALTA' 
                          ? "bg-red-100 text-red-700" 
                          : activity.SEVERIDADE === 'MÉDIA'
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {activity.SEVERIDADE}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.STATUS === "REALIZADA COM SUCESSO" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {activity.STATUS === "REALIZADA COM SUCESSO" ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Sucesso
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            {activity.STATUS}
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AtividadesEngenharia;
