import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AtividadesGlobal = () => {
  const navigate = useNavigate();

  // Mock data for global activities
  const monthlyData = [
    { month: "Jan", total: 45, success: 42, failed: 3 },
    { month: "Fev", total: 52, success: 48, failed: 4 },
    { month: "Mar", total: 48, success: 46, failed: 2 },
    { month: "Abr", total: 55, success: 51, failed: 4 },
    { month: "Mai", total: 61, success: 58, failed: 3 },
    { month: "Jun", total: 58, success: 55, failed: 3 },
  ];

  const totalActivities = monthlyData.reduce((sum, item) => sum + item.total, 0);
  const totalSuccess = monthlyData.reduce((sum, item) => sum + item.success, 0);
  const successRate = ((totalSuccess / totalActivities) * 100).toFixed(1);

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
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Com Falhas</p>
                <p className="text-3xl font-bold text-red-600">{totalActivities - totalSuccess}</p>
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
                <Bar dataKey="total" fill="hsl(var(--primary))" name="Total" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Sucesso vs Falhas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={3}
                  name="Sucesso"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="hsl(0 84% 60%)" 
                  strokeWidth={3}
                  name="Falhas"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activities Table */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Atividades Recentes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Área</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Executor</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "15/06/2025", area: "Marketing", executor: "João Silva", status: "success" },
                  { date: "14/06/2025", area: "Engenharia", executor: "Maria Santos", status: "success" },
                  { date: "14/06/2025", area: "Plataforma", executor: "Pedro Costa", status: "failed" },
                  { date: "13/06/2025", area: "Marketing", executor: "Ana Lima", status: "success" },
                  { date: "13/06/2025", area: "Engenharia", executor: "Carlos Souza", status: "success" },
                ].map((activity, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{activity.date}</td>
                    <td className="py-3 px-4 text-foreground">{activity.area}</td>
                    <td className="py-3 px-4 text-foreground">{activity.executor}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === "success" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {activity.status === "success" ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Realizada com Sucesso
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Com Falhas
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
