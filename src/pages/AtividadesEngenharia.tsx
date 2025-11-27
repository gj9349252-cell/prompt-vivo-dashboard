import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, LabelList } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AtividadesEngenharia = () => {
  const navigate = useNavigate();
  const { engineeringActivities, totalActivities } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredActivities = useMemo(() => {
    if (!startDate || !endDate) return engineeringActivities;
    
    return engineeringActivities.filter(activity => {
      const dateStr = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = dateStr.split('/').map(Number);
      const activityDate = new Date(year, month - 1, day);
      return activityDate >= startDate && activityDate <= endDate;
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

  // Calculate detailed monthly stats
  const monthlyStats = useMemo(() => {
    const stats: Record<string, any> = {};
    
    filteredActivities.forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
      const key = `${year}-${month.padStart(2, '0')}`;
      
      if (!stats[key]) {
        stats[key] = {
          year: parseInt(year),
          month: parseInt(month),
          success: 0,
          partial: 0,
          rollback: 0,
          canceled: 0,
          notExecuted: 0,
          total: 0
        };
      }
      
      stats[key].total++;
      const status = activity.STATUS?.toUpperCase() || '';
      
      if (status.includes('SUCESSO')) stats[key].success++;
      else if (status.includes('PARCIAL')) stats[key].partial++;
      else if (status.includes('ROLLBACK')) stats[key].rollback++;
      else if (status.includes('CANCELAD')) stats[key].canceled++;
      else if (status.includes('NÃO EXECUTAD')) stats[key].notExecuted++;
    });

    return Object.entries(stats)
      .map(([key, data]) => {
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          ...data,
          key,
          monthName: monthNames[data.month - 1],
          fullMonthName: `${monthNames[data.month - 1]}/${String(data.year).slice(2)}`,
          cancelPercentage: data.total > 0 ? Math.round((data.canceled / data.total) * 100) : 0
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredActivities]);

  // Get rollback activities
  const rollbackActivities = useMemo(() => {
    return filteredActivities.filter(a => 
      a.STATUS?.toUpperCase().includes('ROLLBACK')
    );
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
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">ATIVIDADES ENGENHARIA</h1>
            <p className="text-white/90 text-sm mt-1">Análise completa das atividades da área de Engenharia</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Date Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
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
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">Engenharia TV</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">VSA</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.vsa}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">RWs</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.rws}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">RDV</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.rdv}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">SCDN</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.scdn}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">Outras Config</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.outrasConfig}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-1">Participação</p>
                <p className="text-3xl font-bold text-purple-900">{categoryStats.participacao.toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Table Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Total Executado e % Cancelado</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyStats} barGap={0} barCategoryGap={20}>
                  <XAxis 
                    dataKey="monthName" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }} 
                  />
                  <YAxis yAxisId="left" hide={true} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }} 
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="total" 
                    fill="#660099" 
                    name="Total" 
                    radius={[8, 8, 0, 0]}
                  >
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

          {/* Monthly Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead className="text-center">Sucesso</TableHead>
                      <TableHead className="text-center">Parcial</TableHead>
                      <TableHead className="text-center">Rollback</TableHead>
                      <TableHead className="text-center bg-yellow-50">% Cancel</TableHead>
                      <TableHead className="text-center">Não Exec</TableHead>
                      <TableHead className="text-center font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyStats.map((stat) => (
                      <TableRow key={stat.key}>
                        <TableCell className="font-medium">{stat.fullMonthName}</TableCell>
                        <TableCell className="text-center text-green-700">{stat.success}</TableCell>
                        <TableCell className="text-center text-yellow-700">{stat.partial}</TableCell>
                        <TableCell className="text-center text-yellow-700">{stat.rollback}</TableCell>
                        <TableCell className="text-center bg-yellow-50 font-bold text-yellow-900">
                          {stat.cancelPercentage}%
                        </TableCell>
                        <TableCell className="text-center text-yellow-700">{stat.notExecuted}</TableCell>
                        <TableCell className="text-center font-bold">{stat.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
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

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes das Atividades</CardTitle>
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
                  {filteredActivities.slice(0, 50).map((activity, index) => {
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
                        <td className="py-2 px-4">{activity['Executor da Atividade']}</td>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AtividadesEngenharia;