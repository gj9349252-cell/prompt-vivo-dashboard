import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ConsolidadoAnual = () => {
  const navigate = useNavigate();

  // Mock data for annual consolidated view
  const annualData = [
    { month: "Jan", successRate: 93.3, activities: 45 },
    { month: "Fev", successRate: 92.3, activities: 52 },
    { month: "Mar", successRate: 95.8, activities: 48 },
    { month: "Abr", successRate: 92.7, activities: 55 },
    { month: "Mai", successRate: 95.1, activities: 61 },
    { month: "Jun", successRate: 94.8, activities: 58 },
    { month: "Jul", successRate: 91.5, activities: 47 },
    { month: "Ago", successRate: 93.9, activities: 54 },
    { month: "Set", successRate: 96.2, activities: 52 },
    { month: "Out", successRate: 94.1, activities: 49 },
    { month: "Nov", successRate: 95.5, activities: 56 },
    { month: "Dez", successRate: 93.8, activities: 51 },
  ];

  const averageSuccessRate = (annualData.reduce((sum, item) => sum + item.successRate, 0) / annualData.length).toFixed(1);
  const totalActivities = annualData.reduce((sum, item) => sum + item.activities, 0);
  const bestMonth = annualData.reduce((prev, current) => (prev.successRate > current.successRate) ? prev : current);
  const worstMonth = annualData.reduce((prev, current) => (prev.successRate < current.successRate) ? prev : current);

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
            <h1 className="text-3xl font-bold">CONSOLIDADO ANUAL</h1>
            <p className="text-white/90 text-sm mt-1">Análise consolidada do desempenho ao longo do ano</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total no Ano</p>
                <p className="text-3xl font-bold text-primary">{totalActivities}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-3xl font-bold text-accent">{averageSuccessRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Melhor Mês</p>
                <p className="text-xl font-bold text-green-600">{bestMonth.month}</p>
                <p className="text-xs text-muted-foreground">{bestMonth.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menor Taxa</p>
                <p className="text-xl font-bold text-red-600">{worstMonth.month}</p>
                <p className="text-xs text-muted-foreground">{worstMonth.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Chart - Success Rate */}
        <Card className="p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Taxa de Sucesso Mensal (%)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={annualData}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                domain={[85, 100]} 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Taxa de Sucesso (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa de Sucesso']}
              />
              <Line 
                type="monotone" 
                dataKey="successRate" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ r: 5, fill: "hsl(var(--accent))" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Secondary Chart - Activities Volume */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Volume de Atividades ao Longo do Ano
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={annualData}>
              <defs>
                <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
                formatter={(value: number) => [value, 'Atividades']}
              />
              <Area 
                type="monotone" 
                dataKey="activities" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorActivities)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default ConsolidadoAnual;
