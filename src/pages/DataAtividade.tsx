import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useActivitiesData } from "@/hooks/useActivitiesData";

const DataAtividade = () => {
  const navigate = useNavigate();
  const { equipmentData } = useActivitiesData();

  const totalOccurrences = equipmentData.reduce((sum, item) => sum + item.total, 0);

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
            <p className="text-white/90 text-sm mt-1">Análise de falhas por equipamento</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Ocorrências</p>
                <p className="text-3xl font-bold text-primary">{totalOccurrences}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipamentos Monitorados</p>
                <p className="text-3xl font-bold text-accent">{equipmentData.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipamento Crítico</p>
                <p className="text-xl font-bold text-green-600">{equipmentData[0].name}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Total de Falhas por Equipamento
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={equipmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                {equipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Table Section */}
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Detalhamento por Equipamento
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Equipamento</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Total</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Percentual</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipmentData.map((item, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{item.name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-primary">{item.total}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.percentage > 15 
                          ? "bg-red-100 text-red-700" 
                          : item.percentage > 10 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {item.percentage > 15 ? "Crítico" : item.percentage > 10 ? "Atenção" : "Normal"}
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

export default DataAtividade;
