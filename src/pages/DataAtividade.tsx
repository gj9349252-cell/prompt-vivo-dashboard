import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DataAtividade = () => {
  const navigate = useNavigate();
  const { data, equipmentData } = useActivitiesData();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Filter equipment data by date range
  const filteredEquipmentData = useMemo(() => {
    if (!startDate && !endDate) return equipmentData;

    // Filter activities by date range
    const filteredActivities = data.filter(activity => {
      const activityDateStr = activity['DATA/HORA INÍCIO'];
      if (!activityDateStr) return false;
      
      // Extract only the date part (DD/MM/YYYY), ignoring time if present
      const dateOnlyStr = activityDateStr.split(' ')[0];
      const [day, month, year] = dateOnlyStr.split('/');
      
      // Create date at midnight for accurate day comparison
      const activityDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      activityDate.setHours(0, 0, 0, 0);
      
      // Normalize filter dates to midnight
      const normalizedStartDate = startDate ? new Date(startDate) : null;
      if (normalizedStartDate) normalizedStartDate.setHours(0, 0, 0, 0);
      
      const normalizedEndDate = endDate ? new Date(endDate) : null;
      if (normalizedEndDate) normalizedEndDate.setHours(0, 0, 0, 0);
      
      if (normalizedStartDate && normalizedEndDate) {
        return activityDate >= normalizedStartDate && activityDate <= normalizedEndDate;
      } else if (normalizedStartDate) {
        return activityDate >= normalizedStartDate;
      } else if (normalizedEndDate) {
        return activityDate <= normalizedEndDate;
      }
      
      return true;
    });

    // Recalculate equipment totals from filtered activities
    const equipmentFields = [
      'Freeview',
      'Evento Temporal',
      'Novos Canais',
      'Novas Cidades',
      'VSA',
      'VSPP',
      'RWs',
      'SCDN',
      'CDN',
      'FHR',
      'RHR',
      'SCR',
      'RDV',
      'DVB',
      'SWP',
      'OPCH',
      'Dispositivos',
      'Base de dados',
      'Outras Configurações'
    ];

    const totals: Record<string, number> = {};
    equipmentFields.forEach(field => {
      totals[field] = 0;
    });

    filteredActivities.forEach(activity => {
      equipmentFields.forEach(field => {
        if (activity[field as keyof typeof activity] === 1) {
          totals[field]++;
        }
      });
    });

    const totalOccurrences = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return equipmentFields
      .map(field => ({
        name: field,
        total: totals[field],
        percentage: totalOccurrences > 0 ? (totals[field] / totalOccurrences) * 100 : 0
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [data, equipmentData, startDate, endDate]);

  // Calculate KPIs
  const totalOccurrences = filteredEquipmentData.reduce((sum, item) => sum + item.total, 0);
  const monitoredEquipment = filteredEquipmentData.length;
  const criticalEquipment = filteredEquipmentData.length > 0 ? filteredEquipmentData[0].name : "N/A";

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
            <h1 className="text-3xl font-bold">DATA / TIPO ATIVIDADE</h1>
            <p className="text-white/90 text-sm mt-1">Análise por tipo de equipamento e data</p>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data Início</label>
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
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data Fim</label>
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
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
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
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Período selecionado aplicado aos dados
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
              >
                Limpar Filtro
              </Button>
            </div>
          )}
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Total de Ocorrências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{totalOccurrences}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Equipamentos Monitorados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{monitoredEquipment}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Equipamento Crítico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{criticalEquipment}</p>
            </CardContent>
          </Card>
        </div>

        {/* Horizontal Bar Chart */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Total de Falhas por Equipamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={600}>
              <BarChart
                data={filteredEquipmentData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  className="text-xs"
                  width={110}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Total']}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {filteredEquipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#660099" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Equipment Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Detalhamento por Equipamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Equipamento</TableHead>
                  <TableHead className="text-center font-semibold">Total</TableHead>
                  <TableHead className="text-center font-semibold">Percentual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipmentData.map((equipment) => (
                  <TableRow 
                    key={equipment.name}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/equipamento/${encodeURIComponent(equipment.name)}`)}
                  >
                    <TableCell className="font-medium">{equipment.name}</TableCell>
                    <TableCell className="text-center">{equipment.total}</TableCell>
                    <TableCell className="text-center">{equipment.percentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataAtividade;
