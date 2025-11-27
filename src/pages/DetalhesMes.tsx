import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useActivitiesData } from "@/hooks/useActivitiesData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

const DetalhesMes = () => {
  const { mes } = useParams<{ mes: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tipo = searchParams.get('tipo') || 'all';
  
  const { tasksStats } = useActivitiesData();

  // Selecionar dados baseado no tipo
  let allActivities: any[] = [];
  
  if (tipo === 'tasks') {
    allActivities = tasksStats.tasks || [];
  } else if (tipo === 'workorders') {
    allActivities = tasksStats.workOrders || [];
  } else {
    // Combinar tasks e work orders para 'all'
    allActivities = [
      ...(tasksStats.tasks || []),
      ...(tasksStats.workOrders || [])
    ];
  }

  // Filtrar por mês
  const activitiesByMonth = allActivities.filter(activity => {
    const activityMonth = activity['MÊS'];
    return activityMonth === mes;
  });

  // Calcular KPIs
  const total = activitiesByMonth.length;
  const sucesso = activitiesByMonth.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
  const parcial = activitiesByMonth.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
  const cancelada = activitiesByMonth.filter(a => a.STATUS === 'CANCELADA').length;
  const rollback = activitiesByMonth.filter(a => a.STATUS === 'REALIZADO ROLLBACK').length;
  const naoExecutado = activitiesByMonth.filter(a => a.STATUS === 'NÃO EXECUTADO').length;

  // Mapear tipo para label
  const tipoLabel = tipo === 'tasks' ? 'TASKs' : tipo === 'workorders' ? 'Work Orders' : 'Todos';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tasks-front-office')}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Atividades de {mes}</h1>
            <p className="text-muted-foreground">Visualizando: {tipoLabel}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sucesso}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Parcial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{parcial}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cancelada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{cancelada}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rollback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{rollback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Não Executado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{naoExecutado}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento das Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TP SIGITM</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Equipamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activitiesByMonth.length > 0 ? (
                    activitiesByMonth.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{activity['TP SIGITM']}</TableCell>
                        <TableCell>{activity['DATA DA ATIVIDADE']}</TableCell>
                        <TableCell>{activity['EVENTO']}</TableCell>
                        <TableCell>{activity['ÁREA REQUISITANTE']}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${activity.STATUS === 'REALIZADA COM SUCESSO' ? 'bg-green-100 text-green-800' : ''}
                            ${activity.STATUS === 'REALIZADA PARCIALMENTE' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${activity.STATUS === 'CANCELADA' ? 'bg-red-100 text-red-800' : ''}
                            ${activity.STATUS === 'REALIZADO ROLLBACK' ? 'bg-orange-100 text-orange-800' : ''}
                            ${activity.STATUS === 'NÃO EXECUTADO' ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {activity.STATUS}
                          </span>
                        </TableCell>
                        <TableCell>{activity['EQUIPAMENTO']}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhuma atividade encontrada para {mes}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetalhesMes;
