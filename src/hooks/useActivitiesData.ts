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
    'Outras Configurações',
    'Documentação',
    'TAREFA (TASK)'
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

  const getActivitiesByEquipment = (equipmentName: string) => {
    return data.filter(activity => {
      return activity[equipmentName as keyof Activity] === '1';
    });
  };

  return {
    data,
    equipmentData,
    globalActivities,
    globalByMonth,
    annualStats,
    getActivitiesByEquipment
  };
};
