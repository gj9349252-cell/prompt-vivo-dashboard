import { useMemo } from 'react';
import activitiesData from '@/data/atividades.json';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Activity {
  'DATA/HORA INÍCIO': string | number;
  'DATA/HORA \nFIM': string | number;
  'TP \nSIGITM': number;
  'UDO ID': string | number;
  'STATUS': string;
  'EVENTO': string;
  'SEVERIDADE': string;
  'CRITICIDADE': string;
  'Executor da Atividade': string;
  'Área Solicitante': string;
  'Observações'?: string;
  'ID DE BUSCA': string;
  'SEMANA': number;
  'Freeview': number;
  'Evento Temporal': number;
  'Novos Canais': number;
  'Novas Cidades': number;
  'VSA': number;
  'VSPP': number;
  'RWs': number;
  'SCDN': number;
  'CDN': number;
  'FHR': number;
  'RHR': number;
  'SCR': number;
  'RDV': number;
  'DVB': number;
  'SWP': number;
  'OPCH': number;
  'Dispositivos': number;
  'Base de dados': number;
  'Outras Configurações': number;
  'Documentação': number;
  'TAREFA (TASK)': number;
  'Demanda - Global': number;
  'Demanda - Plataforma': number;
  'Demanda - MKT Conteúdos': number;
  'Demanda - Engenharia': number;
  'DIA': number;
  'MÊS': number;
  'ANO': number;
  'Execução - GLOBAL': number;
  'Execução Plataforma BR': number;
  'Validação': string;
  'Consolidado': number;
  'Cancelado': number;
  'Não executado': number;
  'TASK'?: number;
  'Horário Comercial'?: number;
  'Agenda Futura'?: number;
}

const formatBrazilianDate = (dateValue: string | number): string => {
  try {
    // Se for número (Excel serial date)
    if (typeof dateValue === 'number') {
      // Converter Excel serial date para JavaScript Date
      // Excel começa em 30/12/1899, JavaScript em 01/01/1970
      const excelEpoch = new Date(1899, 11, 30);
      const jsDate = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      return format(jsDate, 'dd/MM/yyyy', { locale: ptBR });
    }
    // Se for string, tentar parsear formato brasileiro
    const parsed = parse(dateValue, 'dd/MM/yy', new Date());
    return format(parsed, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return String(dateValue);
  }
};

// Helper functions for activity classification
const isTask = (activity: Activity): boolean => 
  activity['TAREFA (TASK)'] === 1 || activity['TASK'] === 1;

const isWoSemTP = (activity: Activity): boolean => 
  activity['STATUS'] === 'WO EXECUTADA SEM TP';

const isRealizada = (activity: Activity): boolean => {
  const status = activity.STATUS;
  return status === 'REALIZADA COM SUCESSO' || 
         status === 'REALIZADA PARCIALMENTE' || 
         status === 'REALIZADO ROLLBACK' || 
         status === 'AUTORIZADA';
};

const isNaoRealizada = (activity: Activity): boolean => {
  const status = activity.STATUS;
  return status === 'NÃO EXECUTADO' || 
         status === 'CANCELADA' || 
         isWoSemTP(activity);
};

export const useActivitiesData = () => {
  const data = useMemo(() => {
    const rawData = activitiesData as Activity[];
    
    // Obter a data atual do sistema
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // JavaScript meses começam em 0
    const currentYear = today.getFullYear();
    
    // Filtrar apenas atividades até a data atual (excluir datas futuras)
    // Usa campo 'Agenda Futura' === 0 E verificação de data
    const filteredByDate = rawData.filter(activity => {
      // Primeiro, excluir atividades marcadas como Agenda Futura
      if (activity['Agenda Futura'] === 1) return false;
      
      const activityYear = activity['ANO'];
      const activityMonth = activity['MÊS'];
      const activityDay = activity['DIA'];
      
      // Se o ano é anterior ao atual, inclui
      if (activityYear < currentYear) return true;
      // Se o ano é posterior, exclui
      if (activityYear > currentYear) return false;
      
      // Mesmo ano - verificar mês
      if (activityMonth < currentMonth) return true;
      if (activityMonth > currentMonth) return false;
      
      // Mesmo mês - verificar dia
      return activityDay <= currentDay;
    });
    
    return filteredByDate.map(activity => ({
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
        if (activity[field as keyof Activity] === 1) {
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
    return data.filter(activity => activity['Execução - GLOBAL'] === 1);
  }, [data]);

  const globalByMonth = useMemo(() => {
    const monthMap: Record<string, { total: number; success: number; failed: number }> = {};

    globalActivities.forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
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
    // Exclude WO sem TP from annual stats
    const filteredData = data.filter(activity => !isWoSemTP(activity));
    
    const monthMap: Record<string, { 
      total: number; 
      success: number; 
      canceled: number;
    }> = {};
    
    const woSemTPMap: Record<string, number> = {};

    filteredData.forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
      const key = `${year}-${month.padStart(2, '0')}`;

      if (!monthMap[key]) {
        monthMap[key] = { total: 0, success: 0, canceled: 0 };
      }

      monthMap[key].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') {
        monthMap[key].success++;
      }
      if (activity.STATUS === 'CANCELADA') {
        monthMap[key].canceled++;
      }
    });
    
    // Count WO sem TP separately by month
    data.filter(isWoSemTP).forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
      const key = `${year}-${month.padStart(2, '0')}`;
      woSemTPMap[key] = (woSemTPMap[key] || 0) + 1;
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, stats]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          month: monthNames[parseInt(month) - 1],
          total: stats.total,
          canceled: stats.canceled,
          woSemTP: woSemTPMap[key] || 0,
          successRate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0
        };
      });

    const totalActivities = filteredData.length;
    const successfulActivities = filteredData.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
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
    const frontOfficeActivities = data.filter(activity => activity['Área Solicitante'] === 'FRONT OFFICE');
    const tasks = frontOfficeActivities.filter(isTask);
    const workOrders = frontOfficeActivities.filter(a => !isTask(a));
    const woSemTP = frontOfficeActivities.filter(isWoSemTP);
    
    const total = frontOfficeActivities.length;
    const realizadas = frontOfficeActivities.filter(isRealizada).length;
    const naoRealizadas = frontOfficeActivities.filter(isNaoRealizada).length;
    const participacao = data.length > 0 ? (total / data.length) * 100 : 0;
    
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

    frontOfficeActivities.forEach(activity => {
      const month = String(activity['MÊS']);
      const year = String(activity['ANO']);
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
    const totalWorkOrders = workOrders.length;
    const totalSuccess = frontOfficeActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
    const totalPartial = frontOfficeActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
    const totalRollback = frontOfficeActivities.filter(a => a.STATUS === 'REALIZADO ROLLBACK').length;
    const totalAuthorized = frontOfficeActivities.filter(a => a.STATUS === 'AUTORIZADA').length;
    const totalCanceled = frontOfficeActivities.filter(a => a.STATUS === 'CANCELADA').length;
    const totalNotExecuted = frontOfficeActivities.filter(a => a.STATUS === 'NÃO EXECUTADO').length;
    const totalPendingDoc = frontOfficeActivities.filter(a => a.STATUS === 'PENDENTE DOCUMENTAÇÃO').length;
    const totalWoExecuted = woSemTP.length;
    
    // Equipment counts for WO sem TP
    const woSemTPEquipment: Record<string, number> = {};
    equipmentFields.forEach(field => {
      woSemTPEquipment[field] = woSemTP.filter(
        a => a[field as keyof Activity] === 1
      ).length;
    });

    return {
      frontOfficeActivities,
      tasks,
      workOrders,
      total,
      realizadas,
      naoRealizadas,
      participacao,
      totalTasks,
      totalWorkOrders,
      totalSuccess,
      totalPartial,
      totalRollback,
      totalAuthorized,
      totalCanceled,
      totalNotExecuted,
      totalPendingDoc,
      totalWoExecuted,
      woSemTPEquipment,
      monthlyData
    };
  }, [data, equipmentFields]);

  const getActivitiesByEquipment = (equipmentName: string) => {
    return data.filter(activity => {
      return activity[equipmentName as keyof Activity] === 1;
    });
  };

  const engineeringActivities = useMemo(() => {
    return data.filter(activity => activity['Demanda - Engenharia'] === 1);
  }, [data]);

  const engineeringStats = useMemo(() => {
    const total = engineeringActivities.length;
    const realizadas = engineeringActivities.filter(isRealizada).length;
    const naoRealizadas = engineeringActivities.filter(isNaoRealizada).length;
    const participacao = data.length > 0 ? (total / data.length) * 100 : 0;
    
    // Equipment counts
    const equipmentCounts: Record<string, number> = {};
    equipmentFields.forEach(field => {
      equipmentCounts[field] = engineeringActivities.filter(
        a => a[field as keyof Activity] === 1
      ).length;
    });
    
    return {
      total,
      realizadas,
      naoRealizadas,
      participacao,
      equipmentCounts
    };
  }, [engineeringActivities, data, equipmentFields]);

  const marketingActivities = useMemo(() => {
    return data.filter(activity => activity['Demanda - MKT Conteúdos'] === 1);
  }, [data]);

  const platformActivities = useMemo(() => {
    return data.filter(activity => activity['Área Solicitante'] === 'PLATAFORMA' || activity['Área Solicitante'] === 'TV PLATAFORMA BR');
  }, [data]);

  // Marketing Stats - Detailed monthly statistics
  const marketingStats = useMemo(() => {
    const total = marketingActivities.length;
    const realizadas = marketingActivities.filter(isRealizada).length;
    const naoRealizadas = marketingActivities.filter(isNaoRealizada).length;
    const participacao = data.length > 0 ? (total / data.length) * 100 : 0;
    
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
      const monthIndex = activity['MÊS'] - 1;
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
      if (activity['Freeview'] === 1) equipmentCounts['Freeview']++;
      if (activity['Evento Temporal'] === 1) equipmentCounts['Evento Temporal']++;
      if (activity['Novos Canais'] === 1) equipmentCounts['Novos Canais']++;
      if (activity['Novas Cidades'] === 1) equipmentCounts['Novas Cidades']++;
      if (activity['Outras Configurações'] === 1) equipmentCounts['Outras Configurações']++;
    });

    // Partial activities list
    const partialActivities = marketingActivities.filter(
      activity => activity.STATUS === 'REALIZADA PARCIALMENTE'
    );

    return {
      total,
      realizadas,
      naoRealizadas,
      participacao,
      monthlyData,
      equipmentCounts,
      partialActivities
    };
  }, [marketingActivities, data]);

  // Global Demand (Tasks + Work Orders)
  const demandaGlobal = useMemo(() => {
    const tasks = data.filter(isTask);
    const workOrders = data.filter(a => !isTask(a));
    
    return {
      totalTasks: tasks.length,
      totalWorkOrders: workOrders.length,
      total: data.length,
      realizadas: data.filter(isRealizada).length,
      naoRealizadas: data.filter(isNaoRealizada).length,
      participacao: 100 // Global always 100%
    };
  }, [data]);

  // Horário Comercial activities and stats
  const horarioComercialActivities = useMemo(
    () => data.filter(activity => activity['Horário Comercial'] === 1),
    [data]
  );

  const horarioComercialStats = useMemo(() => {
    const total = horarioComercialActivities.length;
    const successCount = horarioComercialActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
    const partialCount = horarioComercialActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
    const rollbackCount = horarioComercialActivities.filter(a => 
      a.STATUS === 'REALIZADO ROLLBACK' || a.STATUS === 'AUTORIZADA'
    ).length;
    const canceledCount = horarioComercialActivities.filter(a => a.STATUS === 'CANCELADA').length;
    const notExecutedCount = horarioComercialActivities.filter(a => 
      a.STATUS === 'NÃO EXECUTADO' || isWoSemTP(a)
    ).length;

    const monthlyData: Record<string, any> = {};
    horarioComercialActivities.forEach(activity => {
      const dateStr = activity['DATA/HORA INÍCIO'];
      if (!dateStr) return;
      
      const [day, month, year] = dateStr.split('/');
      if (!month || !year) return;
      
      const monthKey = `${month.padStart(2, '0')}/${year}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          total: 0,
          success: 0,
          partial: 0,
          rollback: 0,
          canceled: 0,
          notExecuted: 0,
        };
      }
      
      monthlyData[monthKey].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') monthlyData[monthKey].success++;
      if (activity.STATUS === 'REALIZADA PARCIALMENTE') monthlyData[monthKey].partial++;
      if (activity.STATUS === 'REALIZADO ROLLBACK' || activity.STATUS === 'AUTORIZADA') {
        monthlyData[monthKey].rollback++;
      }
      if (activity.STATUS === 'CANCELADA') monthlyData[monthKey].canceled++;
      if (activity.STATUS === 'NÃO EXECUTADO' || isWoSemTP(activity)) {
        monthlyData[monthKey].notExecuted++;
      }
    });

    const monthlyStats = Object.entries(monthlyData)
      .map(([key, stats]: [string, any]) => {
        const [month, year] = key.split('/');
        return {
          monthKey: key,
          month: parseInt(month),
          year: parseInt(year),
          monthName: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
          ...stats,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

    return {
      total,
      successCount,
      partialCount,
      rollbackCount,
      canceledCount,
      notExecutedCount,
      monthlyStats,
    };
  }, [horarioComercialActivities]);

  // Plataforma activities and stats
  const plataformaActivities = useMemo(
    () => data.filter(activity => activity['Demanda - Plataforma'] === 1),
    [data]
  );

  const plataformaStats = useMemo(() => {
    const total = plataformaActivities.length;
    const successCount = plataformaActivities.filter(a => a.STATUS === 'REALIZADA COM SUCESSO').length;
    const partialCount = plataformaActivities.filter(a => a.STATUS === 'REALIZADA PARCIALMENTE').length;
    const rollbackCount = plataformaActivities.filter(a => 
      a.STATUS === 'REALIZADO ROLLBACK' || a.STATUS === 'AUTORIZADA'
    ).length;
    const canceledCount = plataformaActivities.filter(a => a.STATUS === 'CANCELADA').length;
    const notExecutedCount = plataformaActivities.filter(a => 
      a.STATUS === 'NÃO EXECUTADO' || isWoSemTP(a)
    ).length;

    const monthlyData: Record<string, any> = {};
    plataformaActivities.forEach(activity => {
      const dateStr = activity['DATA/HORA INÍCIO'];
      if (!dateStr) return;
      
      const [day, month, year] = dateStr.split('/');
      if (!month || !year) return;
      
      const monthKey = `${month.padStart(2, '0')}/${year}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          total: 0,
          success: 0,
          partial: 0,
          rollback: 0,
          canceled: 0,
          notExecuted: 0,
        };
      }
      
      monthlyData[monthKey].total++;
      if (activity.STATUS === 'REALIZADA COM SUCESSO') monthlyData[monthKey].success++;
      if (activity.STATUS === 'REALIZADA PARCIALMENTE') monthlyData[monthKey].partial++;
      if (activity.STATUS === 'REALIZADO ROLLBACK' || activity.STATUS === 'AUTORIZADA') {
        monthlyData[monthKey].rollback++;
      }
      if (activity.STATUS === 'CANCELADA') monthlyData[monthKey].canceled++;
      if (activity.STATUS === 'NÃO EXECUTADO' || isWoSemTP(activity)) {
        monthlyData[monthKey].notExecuted++;
      }
    });

    const monthlyStats = Object.entries(monthlyData)
      .map(([key, stats]: [string, any]) => {
        const [month, year] = key.split('/');
        return {
          monthKey: key,
          month: parseInt(month),
          year: parseInt(year),
          monthName: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
          ...stats,
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

    return {
      total,
      successCount,
      partialCount,
      rollbackCount,
      canceledCount,
      notExecutedCount,
      monthlyStats,
    };
  }, [plataformaActivities]);

  return {
    data,
    totalActivities: data.length,
    equipmentData,
    globalActivities,
    globalByMonth,
    annualStats,
    tasksStats,
    getActivitiesByEquipment,
    engineeringActivities,
    engineeringStats,
    marketingActivities,
    platformActivities,
    marketingStats,
    demandaGlobal,
    horarioComercialActivities,
    horarioComercialStats,
    plataformaActivities,
    plataformaStats,
  };
};
