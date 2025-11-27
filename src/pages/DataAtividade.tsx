import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Filter, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
  const [selectedDate, setSelectedDate] = useState("");

  // Filter equipment data by selected date
  const filteredEquipmentData = useMemo(() => {
    if (!selectedDate) return equipmentData;

    // Convert selected date (YYYY-MM-DD) to DD/MM/YYYY for comparison
    const [year, month, day] = selectedDate.split('-');
    const formattedSelectedDate = `${day}/${month}/${year}`;

    // Filter activities by date
    const filteredActivities = data.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      if (!activityDate) return false;
      
      // Extract just the date part (DD/MM/YYYY)
      const activityDateOnly = activityDate.split(' ')[0];
      return activityDateOnly === formattedSelectedDate;
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
  }, [data, equipmentData, selectedDate]);

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
          <div className="max-w-md">
            <label className="text-sm text-muted-foreground mb-2 block">Selecionar Data</label>
            <div className="relative">
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
                placeholder="dd/mm/aaaa"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          {selectedDate && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Período selecionado aplicado aos dados
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedDate("")}
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
