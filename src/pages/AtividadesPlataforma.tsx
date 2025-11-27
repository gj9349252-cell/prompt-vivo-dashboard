import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, AlertCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";

const AtividadesPlataforma = () => {
  const navigate = useNavigate();
  const { plataformaStats, totalActivities } = useActivitiesData();

  const { 
    total, 
    successCount, 
    partialCount, 
    rollbackCount, 
    canceledCount, 
    notExecutedCount,
    monthlyStats 
  } = plataformaStats;

  const participacao = totalActivities > 0 ? ((total / totalActivities) * 100).toFixed(2) : '0.00';

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
            <h1 className="text-3xl font-bold">Atividades Programadas - Plataforma</h1>
            <p className="text-white/90 text-sm mt-1">Atividades de origem Plataforma de TV</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{successCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Parcial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{partialCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Rollback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{rollbackCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Cancelados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{canceledCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Não Exec
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{notExecutedCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Participação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{participacao}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Table Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Consolidado Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyStats} barGap={0} barCategoryGap={20}>
                  <XAxis 
                    dataKey="monthName" 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis yAxisId="left" hide={true} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="total" 
                    fill="#660099" 
                    name="Total Executado" 
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
                    yAxisId="left"
                    type="monotone" 
                    dataKey="canceled" 
                    stroke="#F59E0B" 
                    strokeWidth={2} 
                    name="Canceladas"
                    dot={{ fill: '#F59E0B', r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Detalhamento Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold">Mês</th>
                      <th className="text-right py-2 px-2 font-semibold">Sucesso</th>
                      <th className="text-right py-2 px-2 font-semibold">Parcial</th>
                      <th className="text-right py-2 px-2 font-semibold">Rollback</th>
                      <th className="text-right py-2 px-2 font-semibold">Cancel.</th>
                      <th className="text-right py-2 px-2 font-semibold">Não Exec</th>
                      <th className="text-right py-2 px-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyStats.map((stat, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-2 px-2 font-medium">{stat.monthName}</td>
                        <td className="py-2 px-2 text-right text-green-600 font-semibold">{stat.success}</td>
                        <td className="py-2 px-2 text-right text-yellow-600">{stat.partial}</td>
                        <td className="py-2 px-2 text-right text-blue-600">{stat.rollback}</td>
                        <td className="py-2 px-2 text-right text-orange-600">{stat.canceled}</td>
                        <td className="py-2 px-2 text-right text-red-600">{stat.notExecuted}</td>
                        <td className="py-2 px-2 text-right font-bold text-primary">{stat.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explanatory Text */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              As atividades de origem Plataforma de TV têm como característica aplicar alguma correção de configuração 
              ou ajuste técnico na infraestrutura de distribuição de conteúdo. Essas intervenções são críticas para 
              garantir a qualidade do sinal e a disponibilidade dos serviços de televisão, requerendo coordenação 
              com múltiplas áreas técnicas e, frequentemente, execução em janelas de manutenção específicas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AtividadesPlataforma;
