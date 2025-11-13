import { useMemo } from 'react';
import activitiesData from '@/data/atividades.json';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Activity {
  'DATA/HORA INÍCIO': string;
  'DATA/HORA \nFIM': string;
  'TP \nSIGITM': string;
  'UDO ID': string;
  'STATUS': string;
  'EVENTO': string;
  'SEVERIDADE': string;
  'CRITICIDADE': string;
  'Executor da Atividade': string;
  'Área Solicitante': string;
  'Observações': string;
  'ID DE BUSCA': string;
  'SEMANA': string;
  'Freeview': string;
  'Evento Temporal': string;
  'Novos Canais': string;
  'Novas Cidades': string;
  'VSA': string;
  'VSPP': string;
  'RWs': string;
  'SCDN': string;
  'CDN': string;
  'FHR': string;
  'RHR': string;
  'SCR': string;
  'RDV': string;
  'DVB': string;
  'SWP': string;
  'OPCH': string;
  'Dispositivos': string;
  'Base de dados': string;
  'Outras Configurações': string;
  'Documentação': string;
  'TAREFA (TASK)': string;
  'Demanda - Global': string;
  'Demanda - Plataforma': string;
  'Demanda - MKT Conteúdos': string;
  'Demanda - Engenharia': string;
  'DIA': string;
  'MÊS': string;
  'ANO': string;
  'Execução - GLOBAL': string;
  'Execução Plataforma BR': string;
  'Validação': string;
}

const formatBrazilianDate = (dateStr: string): string => {
  try {
    // Formato original: "3/1/25 0:00" ou "06/1/25 0:00"
    const parsed = parse(dateStr, 'M/d/yy H:mm', new Date());
    return format(parsed, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return dateStr;
  }
};

export const useActivitiesData = () => {
  const data = useMemo(() => {
    return (activitiesData as Activity[]).map(activity => ({
      ...activity,
      'DATA/HORA INÍCIO': formatBrazilianDate(activity['DATA/HORA INÍCIO']),
      'DATA/HORA \nFIM': formatBrazilianDate(activity['DATA/HORA \nFIM'])
    }));
  }, []);

  const equipmentFields = useMemo(() => [
    'Freeview',
    'Evento Temporal',
    'Novos Canais',
    'Novas Cidades',
    'VSA',
    'VSPP',
    'RWs',
    'SCDN',
    'CDN',
    'FHR',
    'RHR',
    'SCR',
    'RDV',
    'DVB',
    'SWP',
    'OPCH',
    'Dispositivos',
    'Base de dados',
    'Outras Configurações'
  ], []);

  const equipmentData = useMemo(() => {
    const totals: Record<string, number> = {};
    
    equipmentFields.forEach(field => {
      totals[field] = 0;
    });

    data.forEach(activity => {
      equipmentFields.forEach(field => {
        if (activity[field as keyof Activity] === '1') {
          totals[field]++;
        }
      });
    });

    const totalOccurrences = Object.values(totals).reduce((sum, val) => sum + val, 0);

    return equipmentFields
      .map(field => ({
        name: field,
        total: totals[field],
        percentage: totalOccurrences > 0 ? (totals[field] / totalOccurrences) * 100 : 0
      }))
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [data, equipmentFields]);

  const globalActivities = useMemo(() => {
    return data.filter(activity => activity['Execução - GLOBAL'] === '1');
  }, [data]);

  const globalByMonth = useMemo(() => {
    const monthMap: Record<string, { total: number; success: number; failed: number }> = {};

    globalActivities.forEach(activity => {
      const month = activity['MÊS'];
      const year = activity['ANO'];
      const key = `${year}-${month.padStart(2, '0')}`;

      if (!monthMap[key]) {
        monthMap[key] = { total: 0, success: 0, failed: 0 };
      }

      monthMap[key].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') {
        monthMap[key].success++;
      } else {
        monthMap[key].failed++;
      }
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          month: monthNames[parseInt(month) - 1],
          total: stats.total,
          success: stats.success,
          failed: stats.failed,
          successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
        };
      });
  }, [globalActivities]);

  const annualStats = useMemo(() => {
    const monthMap: Record<string, { total: number; success: number }> = {};

    data.forEach(activity => {
      const month = activity['MÊS'];
      const year = activity['ANO'];
      const key = `${year}-${month.padStart(2, '0')}`;

      if (!monthMap[key]) {
        monthMap[key] = { total: 0, success: 0 };
      }

      monthMap[key].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') {
        monthMap[key].success++;
      }
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          month: monthNames[parseInt(month) - 1],
          total: stats.total,
          successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
        };
      });

    const totalActivities = data.length;
    const successfulActivities = data.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
    const avgSuccessRate = totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0;

    const bestMonth = monthlyData.reduce((best, current) => 
      current.successRate > best.successRate ? current : best
    , monthlyData[0] || { month: '-', successRate: 0 });

    const worstMonth = monthlyData.reduce((worst, current) => 
      current.successRate < worst.successRate ? current : worst
    , monthlyData[0] || { month: '-', successRate: 0 });

    return {
      totalActivities,
      avgSuccessRate,
      bestMonth,
      worstMonth,
      monthlyData
    };
  }, [data]);

  const tasksStats = useMemo(() => {
    const tasks = data.filter(activity => activity['Área Solicitante'] === 'FRONT OFFICE');
    
    const monthMap: Record<string, { 
      success: number; 
      partial: number; 
      rollback: number; 
      authorized: number;
      canceled: number; 
      notExecuted: number;
      pendingDoc: number;
      woExecuted: number;
      total: number 
    }> = {};

    tasks.forEach(activity => {
      const month = activity['MÊS'];
      const year = activity['ANO'];
      const key = `${year}-${month.padStart(2, '0')}`;

      if (!monthMap[key]) {
        monthMap[key] = { 
          success: 0, 
          partial: 0, 
          rollback: 0, 
          authorized: 0,
          canceled: 0, 
          notExecuted: 0,
          pendingDoc: 0,
          woExecuted: 0,
          total: 0 
        };
      }

      monthMap[key].total++;
      
      const status = activity.STATUS;
      if (status === 'REALIZADA COM SUCESSO') {
        monthMap[key].success++;
      } else if (status === 'REALIZADA PARCIALMENTE') {
        monthMap[key].partial++;
      } else if (status === 'REALIZADO ROLLBACK') {
        monthMap[key].rollback++;
      } else if (status === 'AUTORIZADA') {
        monthMap[key].authorized++;
      } else if (status === 'CANCELADA') {
        monthMap[key].canceled++;
      } else if (status === 'NÃO EXECUTADO') {
        monthMap[key].notExecuted++;
      } else if (status === 'PENDENTE DOCUMENTAÇÃO') {
        monthMap[key].pendingDoc++;
      } else if (status === 'WO EXECUTADA SEM TP') {
        monthMap[key].woExecuted++;
      }
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const executed = stats.success + stats.partial + stats.rollback + stats.authorized + stats.woExecuted;
        return {
          month: monthNames[parseInt(month) - 1],
          success: stats.success,
          partial: stats.partial,
          rollback: stats.rollback,
          authorized: stats.authorized,
          canceled: stats.canceled,
          notExecuted: stats.notExecuted,
          pendingDoc: stats.pendingDoc,
          woExecuted: stats.woExecuted,
          total: stats.total,
          executed,
          canceledPercentage: executed > 0 ? (stats.canceled / stats.total) * 100 : 0
        };
      });

    const totalTasks = tasks.length;
    const totalSuccess = tasks.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
    const totalPartial = tasks.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
    const totalRollback = tasks.filter(a => a.STATUS === 'REALIZADO ROLLBACK').length;
    const totalAuthorized = tasks.filter(a => a.STATUS === 'AUTORIZADA').length;
    const totalCanceled = tasks.filter(a => a.STATUS === 'CANCELADA').length;
    const totalNotExecuted = tasks.filter(a => a.STATUS === 'NÃO EXECUTADO').length;
    const totalPendingDoc = tasks.filter(a => a.STATUS === 'PENDENTE DOCUMENTAÇÃO').length;
    const totalWoExecuted = tasks.filter(a => a.STATUS === 'WO EXECUTADA SEM TP').length;

    return {
      totalTasks,
      totalSuccess,
      totalPartial,
      totalRollback,
      totalAuthorized,
      totalCanceled,
      totalNotExecuted,
      totalPendingDoc,
      totalWoExecuted,
      monthlyData
    };
  }, [data]);

  const getActivitiesByEquipment = (equipmentName: string) => {
    return data.filter(activity => {
      return activity[equipmentName as keyof Activity] === '1';
    });
  };

  const engineeringActivities = useMemo(() => {
    return data.filter(activity => activity['Área Solicitante'] === 'ENGENHARIA');
  }, [data]);

  const marketingActivities = useMemo(() => {
    return data.filter(activity => activity['Área Solicitante'] === 'MARKETING' || activity['Área Solicitante'] === 'MKT CONTEÚDOS');
  }, [data]);

  const platformActivities = useMemo(() => {
    return data.filter(activity => activity['Área Solicitante'] === 'PLATAFORMA' || activity['Área Solicitante'] === 'TV PLATAFORMA BR');
  }, [data]);

  // Marketing Stats - Detailed monthly statistics
  const marketingStats = useMemo(() => {
    const monthlyData: Record<string, {
      success: number;
      partial: number;
      rollback: number;
      canceled: number;
      notExecuted: number;
      total: number;
    }> = {};

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Initialize all months
    monthNames.forEach((month) => {
      monthlyData[month] = {
        success: 0,
        partial: 0,
        rollback: 0,
        canceled: 0,
        notExecuted: 0,
        total: 0
      };
    });

    // Count activities by month and status
    marketingActivities.forEach(activity => {
      const monthIndex = parseInt(activity['MÊS']) - 1;
      const monthName = monthNames[monthIndex];
      
      if (monthlyData[monthName]) {
        monthlyData[monthName].total++;
        
        const status = activity.STATUS;
        if (status === 'REALIZADA COM SUCESSO') {
          monthlyData[monthName].success++;
        } else if (status === 'REALIZADA PARCIALMENTE') {
          monthlyData[monthName].partial++;
        } else if (status === 'REALIZADA ROLLBACK') {
          monthlyData[monthName].rollback++;
        } else if (status === 'CANCELADO') {
          monthlyData[monthName].canceled++;
        } else {
          monthlyData[monthName].notExecuted++;
        }
      }
    });

    // Equipment counts for marketing
    const equipmentCounts: Record<string, number> = {
      'MKT Conteúdos': marketingActivities.length,
      'Freeview': 0,
      'Evento Temporal': 0,
      'Novos Canais': 0,
      'Novas Cidades': 0,
      'Outras Configurações': 0
    };

    marketingActivities.forEach(activity => {
      if (activity['Freeview'] === '1') equipmentCounts['Freeview']++;
      if (activity['Evento Temporal'] === '1') equipmentCounts['Evento Temporal']++;
      if (activity['Novos Canais'] === '1') equipmentCounts['Novos Canais']++;
      if (activity['Novas Cidades'] === '1') equipmentCounts['Novas Cidades']++;
      if (activity['Outras Configurações'] === '1') equipmentCounts['Outras Configurações']++;
    });

    // Participation percentage
    const totalActivities = data.length;
    const participationPercentage = totalActivities > 0 
      ? ((marketingActivities.length / totalActivities) * 100).toFixed(1)
      : '0';

    // Partial activities list
    const partialActivities = marketingActivities.filter(
      activity => activity.STATUS === 'REALIZADA PARCIALMENTE'
    );

    return {
      monthlyData,
      equipmentCounts,
      participationPercentage,
      partialActivities
    };
  }, [marketingActivities, data]);

  return {
    data,
    equipmentData,
    globalActivities,
    globalByMonth,
    annualStats,
    tasksStats,
    getActivitiesByEquipment,
    engineeringActivities,
    marketingActivities,
    platformActivities,
    marketingStats
  };
};
