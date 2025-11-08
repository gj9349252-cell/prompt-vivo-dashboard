import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Server, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";

const AtividadesPlataforma = () => {
  const navigate = useNavigate();
  const { platformActivities } = useActivitiesData();

  const totalActivities = platformActivities.length;
  const totalSuccess = platformActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
  const totalFailed = totalActivities - totalSuccess;
  const successRate = totalActivities > 0 ? ((totalSuccess / totalActivities) * 100).toFixed(1) : '0';

  // Agrupa por mês
  const monthlyStats = platformActivities.reduce((acc, activity) => {
    const month = activity['MÊS'];
    const year = activity['ANO'];
    const key = `${year}-${month.padStart(2, '0')}`;
    
    if (!acc[key]) {
      acc[key] = { success: 0, failed: 0, total: 0 };
    }
    
    acc[key].total++;
    if (activity.STATUS === 'REALIZADA COM SUCESSO') {
      acc[key].success++;
    } else {
      acc[key].failed++;
    }
    
    return acc;
  }, {} as Record<string, { success: number; failed: number; total: number }>);

  const monthlyData = Object.entries(monthlyStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, stats]) => {
      const [year, month] = key.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return {
        month: monthNames[parseInt(month) - 1],
        success: stats.success,
        failed: stats.failed,
        total: stats.total
      };
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white py-6 px-6 shadow-elevated">
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
            <Server className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">ATIVIDADES PLATAFORMA</h1>
              <p className="text-white/90 text-sm mt-1">Análise completa das atividades da área de Plataforma</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Atividades</p>
                <p className="text-3xl font-bold text-green-600">{totalActivities}</p>
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
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Falhas</p>
                <p className="text-3xl font-bold text-red-600">{totalFailed}</p>
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
            Atividades Mensais - Plataforma
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar dataKey="success" fill="hsl(142 76% 36%)" name="Sucesso" radius={[8, 8, 0, 0]} />
              <Bar dataKey="failed" fill="hsl(0 84% 60%)" name="Falhas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activities Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Detalhes das Atividades - Plataforma
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
                {platformActivities.map((activity, index) => (
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

export default AtividadesPlataforma;
