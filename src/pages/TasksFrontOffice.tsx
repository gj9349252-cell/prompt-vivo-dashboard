import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TasksFrontOffice = () => {
  const { tasksStats } = useActivitiesData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">
            PORTAL ATIVIDADES PROGRAMADAS – PLATAFORMA DE TV – Front Office (TASK)
          </h1>
          <p className="text-sm mt-2 text-primary-foreground/80">
            Relógio com data e hora atual
          </p>
        </div>

        {/* KPIs - Linha 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/80 backdrop-blur border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                TOTAL DE ATIVIDADES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary text-center">
                {tasksStats.totalTasks}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Realizadas com Sucesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 text-center">
                {tasksStats.totalSuccess}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-yellow-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Realizadas Parcialmente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600 text-center">
                {tasksStats.totalPartial}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Realizado Rollback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600 text-center">
                {tasksStats.totalRollback}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs - Linha 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-card/80 backdrop-blur border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Autorizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 text-center">
                {tasksStats.totalAuthorized}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Cancelada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600 text-center">
                {tasksStats.totalCanceled}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-gray-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Não Executado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-600 text-center">
                {tasksStats.totalNotExecuted}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                Pendente Documentação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600 text-center">
                {tasksStats.totalPendingDoc}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-teal-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                WO Executada sem TP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-600 text-center">
                {tasksStats.totalWoExecuted}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-primary">Consolidado Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={tasksStats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="success" name="Sucesso" fill="hsl(var(--primary))" stackId="a" />
                  <Bar dataKey="partial" name="Parcial" fill="hsl(280, 60%, 50%)" stackId="a" />
                  <Bar dataKey="rollback" name="Rollback" fill="hsl(280, 40%, 30%)" stackId="a" />
                  <Line 
                    type="monotone" 
                    dataKey="canceledPercentage" 
                    name="% Cancelado"
                    stroke="#FF9800"
                    strokeWidth={3}
                    dot={{ fill: '#FF9800', r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-card/80 backdrop-blur">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[450px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-primary z-10">
                  <TableRow>
                      <TableHead className="text-primary-foreground font-bold"></TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Sucesso</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Parcial</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Rollback</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Autoriz.</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Cancel.</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Não Exec</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Pend Doc</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">WO s/TP</TableHead>
                      <TableHead className="text-primary-foreground font-bold text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasksStats.monthlyData.map((month) => (
                      <TableRow key={month.month} className="hover:bg-primary/5">
                        <TableCell className="font-semibold text-primary">{month.month}</TableCell>
                        <TableCell className="text-center">{month.success}</TableCell>
                        <TableCell className="text-center">{month.partial}</TableCell>
                        <TableCell className="text-center">{month.rollback}</TableCell>
                        <TableCell className="text-center">{month.authorized}</TableCell>
                        <TableCell className="text-center">{month.canceled}</TableCell>
                        <TableCell className="text-center">{month.notExecuted}</TableCell>
                        <TableCell className="text-center">{month.pendingDoc}</TableCell>
                        <TableCell className="text-center">{month.woExecuted}</TableCell>
                        <TableCell className="text-center font-semibold">{month.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TasksFrontOffice;
