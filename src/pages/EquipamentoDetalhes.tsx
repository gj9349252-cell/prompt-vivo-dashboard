import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";

const EquipamentoDetalhes = () => {
  const navigate = useNavigate();
  const { equipmentName } = useParams<{ equipmentName: string }>();
  const { getActivitiesByEquipment, equipmentData } = useActivitiesData();

  const decodedEquipmentName = equipmentName ? decodeURIComponent(equipmentName) : '';
  const activities = getActivitiesByEquipment(decodedEquipmentName);
  const equipmentInfo = equipmentData.find(e => e.name === decodedEquipmentName);

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
          <div>
            <h1 className="text-3xl font-bold">{decodedEquipmentName}</h1>
            <p className="text-white/90 text-sm mt-1">Detalhamento de eventos por equipamento</p>
          </div>
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
                <p className="text-sm text-muted-foreground">Total de Ocorrências</p>
                <p className="text-3xl font-bold text-primary">{equipmentInfo?.total || 0}</p>
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
                <p className="text-3xl font-bold text-accent">{activities.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentual do Total</p>
                <p className="text-3xl font-bold text-green-600">{equipmentInfo?.percentage.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Events Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Histórico de Eventos - {decodedEquipmentName}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data Início</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data Fim</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">TP SIGITM</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Evento</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Executor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Área</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Severidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA INÍCIO']}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['DATA/HORA \nFIM']}</td>
                    <td className="py-3 px-4 text-foreground text-sm font-mono">{activity['TP \nSIGITM']}</td>
                    <td className="py-3 px-4 text-foreground text-sm max-w-md">
                      <div className="truncate" title={activity.EVENTO}>
                        {activity.EVENTO}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['Executor da Atividade']}</td>
                    <td className="py-3 px-4 text-foreground text-sm">{activity['Área Solicitante']}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.SEVERIDADE === 'ALTA' 
                          ? 'bg-red-100 text-red-700' 
                          : activity.SEVERIDADE === 'MÉDIA'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {activity.SEVERIDADE}
                      </span>
                    </td>
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
