import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Clock, Filter, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ComposedChart, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AtividadesGlobal = () => {
  const navigate = useNavigate();
  const { globalActivities, globalByMonth } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredActivities = useMemo(() => {
    if (!startDate && !endDate) return globalActivities;

    return globalActivities.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = activityDate.split('/');
      const activityFullDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (startDate && activityFullDate < startDate) return false;
      if (endDate && activityFullDate > endDate) return false;
      return true;
    });
  }, [globalActivities, startDate, endDate]);

  const monthlyData = globalByMonth;
  const totalActivities = filteredActivities.length;
  const totalSuccess = filteredActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
  const totalRollback = filteredActivities.filter(a => a.STATUS === 'REALIZADO ROLLBACK').length;
  const totalCanceled = filteredActivities.filter(a => a.STATUS === 'CANCELADA').length;
  const totalPartial = filteredActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
  const totalNotExecuted = filteredActivities.filter(a => a.STATUS === 'NÃO EXECUTADO').length;
  const totalWoSemTp = filteredActivities.filter(a => a.STATUS === 'WO EXECUTADA SEM TP').length;
  const successRate = totalActivities > 0 ? ((totalSuccess / totalActivities) * 100).toFixed(1) : '0';

  // Prepare monthly status data - total + canceladas line
  const monthlyStatusData = useMemo(() => {
    const monthsMap: Record<string, any> = {};
    
    filteredActivities.forEach(activity => {
      const date = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = date.split('/');
      const monthKey = `${month}/${year}`;
      
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = {
          month: monthKey,
          total: 0,
          cancelada: 0
        };
      }
      
      monthsMap[monthKey].total++;
      
      if (activity.STATUS === 'CANCELADA') {
        monthsMap[monthKey].cancelada++;
      }
    });
    
    return Object.values(monthsMap).sort((a: any, b: any) => {
      const [monthA, yearA] = a.month.split('/');
      const [monthB, yearB] = b.month.split('/');
      return yearA === yearB ? parseInt(monthA) - parseInt(monthB) : parseInt(yearA) - parseInt(yearB);
    });
  }, [filteredActivities]);

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
          <div>
            <h1 className="text-3xl font-bold">ATIVIDADES GLOBAL</h1>
            <p className="text-white/90 text-sm mt-1">Visão completa de todas as atividades executadas</p>
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
                <p className="text-sm text-muted-foreground">Realizadas</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WO sem TP</p>
                <p className="text-3xl font-bold text-purple-600">{totalWoSemTp}</p>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Atividades por Mês
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
                <Bar dataKey="total" fill="#660099" name="Total" radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="total" 
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

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Total de Atividades e Cancelamentos
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyStatusData} barGap={0} barCategoryGap={20}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" hide={true} />
                <YAxis yAxisId="right" orientation="right" hide={true} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="total" fill="#660099" name="Total" radius={[8, 8, 0, 0]}>
                  <LabelList 
                    dataKey="total" 
                    position="center" 
                    fill="white" 
                    fontSize={12}
                    fontWeight="bold"
                    formatter={(value: number) => value > 0 ? value : ''}
                  />
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="cancelada" 
                  stroke="#EF4444" 
                  strokeWidth={1.5} 
                  name="Canceladas"
                  dot={{ fill: '#EF4444', r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activities Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Detalhes das Atividades Recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data Início</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data Fim</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Área</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Executor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Evento</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Severidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.slice(0, 50).map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA INÍCIO']}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA \nFIM']}</td>
                    <td className="py-3 px-4 text-foreground font-medium">{activity['Área Solicitante']}</td>
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

export default AtividadesGlobal;
