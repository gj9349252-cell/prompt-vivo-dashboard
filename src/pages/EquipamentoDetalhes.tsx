import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, AlertCircle, CheckCircle2, Filter, X } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { useMemo } from "react";

const EquipamentoDetalhes = () => {
  const navigate = useNavigate();
  const { equipmentName } = useParams<{ equipmentName: string }>();
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const { getActivitiesByEquipment, equipmentData } = useActivitiesData();

  const decodedEquipmentName = equipmentName ? decodeURIComponent(equipmentName) : '';
  const allActivities = getActivitiesByEquipment(decodedEquipmentName);
  
  const activities = useMemo(() => {
    if (!startDate && !endDate) return allActivities;
    
    return allActivities.filter(activity => {
      const activityDate = activity['DATA/HORA INÍCIO'];
      if (!activityDate) return false;
      
      // Converter data brasileira DD/MM/YY para formato ISO YYYY-MM-DD
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
  }, [allActivities, startDate, endDate]);

  const equipmentInfo = equipmentData.find(e => e.name === decodedEquipmentName);
  
  const filteredTotal = activities.length;
  const filteredPercentage = equipmentInfo && equipmentInfo.total > 0 
    ? (filteredTotal / equipmentInfo.total) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white py-6 px-6 shadow-elevated">
        <div className="container mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/data-atividade")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{decodedEquipmentName}</h1>
            <p className="text-white/90 text-sm mt-1">Detalhamento de eventos por equipamento</p>
            {(startDate || endDate) && (
              <p className="text-white/90 text-sm mt-1 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtrado por período: 
                {startDate && ` de ${new Date(startDate).toLocaleDateString('pt-BR')}`}
                {endDate && ` até ${new Date(endDate).toLocaleDateString('pt-BR')}`}
              </p>
            )}
          </div>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/equipamento/${encodeURIComponent(decodedEquipmentName)}`)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar Filtro
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {(startDate || endDate) ? 'Ocorrências no Período' : 'Total de Ocorrências'}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {(startDate || endDate) ? filteredTotal : (equipmentInfo?.total || 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos Registrados</p>
                <p className="text-3xl font-bold text-accent">{filteredTotal}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {(startDate || endDate) ? 'Percentual do Período' : 'Percentual do Total'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {(startDate || endDate) 
                    ? filteredPercentage.toFixed(1)
                    : equipmentInfo?.percentage.toFixed(1)
                  }%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {(startDate || endDate)
              ? `Eventos Filtrados - ${decodedEquipmentName}`
              : `Histórico de Eventos - ${decodedEquipmentName}`
            }
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">TP SIGITM</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data de Execução</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Área Solicitante</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Encerramento</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground text-sm font-mono">{activity['TP \nSIGITM']}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA INÍCIO']}</td>
                    <td className="py-3 px-4 text-foreground text-sm max-w-md">
                      <div className="truncate" title={activity.EVENTO}>
                        {activity.EVENTO}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['Área Solicitante']}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        activity.STATUS === "REALIZADA COM SUCESSO" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {activity.STATUS === "REALIZADA COM SUCESSO" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Sucesso
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            {activity.STATUS}
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento encontrado para este equipamento
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EquipamentoDetalhes;
