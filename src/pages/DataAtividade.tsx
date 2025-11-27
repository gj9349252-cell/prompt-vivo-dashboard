import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useState, useMemo } from "react";

const DataAtividade = () => {
  const navigate = useNavigate();
  const { data, equipmentData, totalActivities } = useActivitiesData();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter equipment data by date range
  const filteredEquipmentData = useMemo(() => {
    if (!startDate && !endDate) return equipmentData;

    // Filter activities by date first
    const filteredActivities = data.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      if (!activityDate) return false;
      
      const [day, month, year] = activityDate.split('/');
      if (!day || !month || !year) return false;
      
      let fullYear = year;
      if (year.length === 2) {
        const yearNum = parseInt(year, 10);
        fullYear = yearNum < 50 ? `20${year}` : `19${year}`;
      }
      
      const paddedDay = day.padStart(2, '0');
      const paddedMonth = month.padStart(2, '0');
      const activityFullDate = `${fullYear}-${paddedMonth}-${paddedDay}`;

      if (startDate && endDate) {
        return activityFullDate >= startDate && activityFullDate <= endDate;
      } else if (startDate) {
        return activityFullDate >= startDate;
      } else if (endDate) {
        return activityFullDate <= endDate;
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

  const handleEquipmentClick = (equipmentName: string) => {
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      navigate(`/equipamento/${encodeURIComponent(equipmentName)}?${params.toString()}`);
    } else {
      navigate(`/equipamento/${encodeURIComponent(equipmentName)}`);
    }
  };

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
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Período selecionado aplicado aos equipamentos
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setStartDate(""); setEndDate(""); }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </Card>

        {/* Equipment Cards */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Equipamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredEquipmentData.map((equipment) => (
              <Card
                key={equipment.name}
                className="shadow-card hover:shadow-elevated transition-all cursor-pointer hover:scale-105 hover:border-primary border-2"
                onClick={() => handleEquipmentClick(equipment.name)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {equipment.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-primary">{equipment.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {equipment.percentage.toFixed(1)}% do total
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              Clique em um equipamento para ver detalhes das atividades relacionadas. 
              Use os filtros de data acima para visualizar atividades de um período específico.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataAtividade;
