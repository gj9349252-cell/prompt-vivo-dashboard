import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";

const ConsolidadoAnual = () => {
  const navigate = useNavigate();
  const { annualStats } = useActivitiesData();

  const annualData = annualStats.monthlyData;
  const totalActivities = annualStats.totalActivities;
  const averageSuccessRate = annualStats.avgSuccessRate.toFixed(1);
  const bestMonth = annualStats.bestMonth;
  const worstMonth = annualStats.worstMonth;

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

        {/* Main Chart - Activities Volume */}
        <Card className="p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Volume de Atividades ao Longo do Ano
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={annualData} barGap={0} barCategoryGap={20}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                fill="#660099" 
                name="Total de Atividades" 
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
                type="monotone" 
                dataKey="canceled" 
                stroke="#F59E0B" 
                strokeWidth={2} 
                name="Canceladas"
                dot={{ fill: '#F59E0B', r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Secondary Chart - Success Rate */}
        <Card className="p-6 shadow-card">
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
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis 
                domain={[85, 100]} 
                hide={true}
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
                stroke="#660099" 
                strokeWidth={3}
                dot={{ r: 5, fill: "#660099" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default ConsolidadoAnual;
