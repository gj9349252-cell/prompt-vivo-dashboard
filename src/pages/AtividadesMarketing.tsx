import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LabelList 
} from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AtividadesMarketing = () => {
  const navigate = useNavigate();
  const { marketingStats, marketingActivities } = useActivitiesData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const partialActivities = marketingActivities.filter(
    a => a.STATUS === 'REALIZADA PARCIALMENTE'
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-6 px-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">ATIVIDADES MARKETING</h1>
                <p className="text-white/90 text-sm mt-1">Análise completa das atividades da área de Marketing</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {format(currentTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="text-center">
              <p className="text-sm font-medium mb-2 text-white/90">Execução Global</p>
              <p className="text-5xl font-bold">{marketingStats.executionGlobal}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="text-center">
              <p className="text-sm font-medium mb-2 text-white/90">WO</p>
              <p className="text-5xl font-bold">{marketingStats.woCount}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="text-center">
              <p className="text-sm font-medium mb-2 text-white/90">TASK</p>
              <p className="text-5xl font-bold">{marketingStats.taskCount}</p>
            </div>
          </Card>
        </div>

        {/* Consolidado Anual Chart */}
        <Card className="p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Consolidado Anual</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={marketingStats.monthlyData}>
              <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="monthShort" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              
              {/* Barras empilhadas */}
              <Bar 
                yAxisId="left" 
                dataKey="success" 
                stackId="a" 
                fill="#9333ea" 
                name="Sucesso"
                radius={[0, 0, 0, 0]}
              >
                <LabelList 
                  dataKey="success" 
                  position="inside" 
                  fill="white" 
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                />
              </Bar>
              <Bar 
                yAxisId="left" 
                dataKey="partial" 
                stackId="a" 
                fill="#eab308" 
                name="Parcial"
                radius={[0, 0, 0, 0]}
              >
                <LabelList 
                  dataKey="partial" 
                  position="inside" 
                  fill="white" 
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                />
              </Bar>
              <Bar 
                yAxisId="left" 
                dataKey="rollback" 
                stackId="a" 
                fill="#ec4899" 
                name="Rollback"
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="rollback" 
                  position="inside" 
                  fill="white" 
                  style={{ fontSize: '11px', fontWeight: 'bold' }}
                />
              </Bar>
              
              {/* Linha de percentual */}
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="successPercentage" 
                stroke="#eab308" 
                strokeWidth={3}
                dot={{ r: 5, fill: "#eab308" }}
                name="% Sucesso"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Detailed Monthly Table */}
        <Card className="p-6 mb-8 shadow-lg overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Detalhamento Mensal</h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-600 hover:bg-purple-600">
                <TableHead className="text-white font-bold">Mês</TableHead>
                <TableHead className="text-white font-bold text-center">Sucesso</TableHead>
                <TableHead className="text-white font-bold text-center">Parcial</TableHead>
                <TableHead className="text-white font-bold text-center">Rollback</TableHead>
                <TableHead className="text-white font-bold text-center">Cancelado</TableHead>
                <TableHead className="text-white font-bold text-center">% Cancelado</TableHead>
                <TableHead className="text-white font-bold text-center">Não executado</TableHead>
                <TableHead className="text-white font-bold text-center">Total Executado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketingStats.monthlyData.map((row) => (
                <TableRow key={row.month} className="hover:bg-muted/50">
                  <TableCell className="font-semibold">{row.month}</TableCell>
                  <TableCell className="text-center">{row.success}</TableCell>
                  <TableCell className="text-center">{row.partial}</TableCell>
                  <TableCell className="text-center">{row.rollback}</TableCell>
                  <TableCell className="text-center">{row.canceled}</TableCell>
                  <TableCell className="text-center font-bold text-purple-600">
                    {row.canceledPercentage.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">{row.notExecuted}</TableCell>
                  <TableCell className="text-center font-bold">{row.totalExecuted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Realizada Parcialmente Section */}
        {partialActivities.length > 0 && (
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Realizada Parcialmente</h2>
            <div className="space-y-3">
              {partialActivities.map(activity => (
                <div 
                  key={activity['TP \nSIGITM']} 
                  className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg"
                >
                  <p className="font-semibold text-foreground">
                    TP: {activity['TP \nSIGITM']}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity['ID DE BUSCA']}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AtividadesMarketing;
