import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

const DataAtividade = () => {
  const navigate = useNavigate();
  const { equipmentData, data } = useActivitiesData();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredEquipmentData = useMemo(() => {
    if (!startDate && !endDate) return equipmentData;

    const filteredActivities = data.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      const [day, month, year] = activityDate.split('/');
      const activityFullDate = `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      if (startDate && activityFullDate < startDate) return false;
      if (endDate && activityFullDate > endDate) return false;
      return true;
    });

    const equipmentFields = [
      'VSA', 'VSPP', 'RWs', 'SCDN', 'CDN', 'FHR', 'RHR', 'SCR', 'RDV', 'DVB', 'SWP', 'OPCH'
    ];

    const totals: Record<string, number> = {};
    equipmentFields.forEach(field => {
      totals[field] = 0;
    });

    filteredActivities.forEach(activity => {
      equipmentFields.forEach(field => {
        if (activity[field as keyof typeof activity] === '1') {
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
  }, [equipmentData, data, startDate, endDate]);

  const totalOccurrences = filteredEquipmentData.reduce((sum, item) => sum + item.total, 0);

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
            <p className="text-white/90 text-sm mt-1">Análise de falhas por equipamento</p>
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
              <Input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Data Fim</label>
              <Input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          {(startDate || endDate) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          )}
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Ocorrências</p>
                <p className="text-3xl font-bold text-primary">{totalOccurrences}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipamentos Monitorados</p>
                <p className="text-3xl font-bold text-accent">{filteredEquipmentData.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipamento Crítico</p>
                <p className="text-xl font-bold text-green-600">{filteredEquipmentData[0]?.name || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Total de Falhas por Equipamento
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredEquipmentData} layout="vertical">
              <XAxis type="number" hide={true} />
              <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                <LabelList 
                  dataKey="total" 
                  position="center" 
                  fill="white" 
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(value: number) => value > 0 ? value : ''}
                />
                {filteredEquipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Table Section */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Detalhamento por Equipamento
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Equipamento</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Total</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Percentual</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipmentData.map((item, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/equipamento/${encodeURIComponent(item.name)}`)}
                  >
                    <td className="py-3 px-4 text-foreground hover:text-primary transition-colors font-medium">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-primary">{item.total}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
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

export default DataAtividade;
