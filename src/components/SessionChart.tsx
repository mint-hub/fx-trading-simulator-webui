import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SessionDetail, ScenarioData } from '../types/api';

interface SessionChartProps {
  sessions: SessionDetail[];
  scenarioData: ScenarioData | null;
  loading: boolean;
}

const SessionChart: React.FC<SessionChartProps> = ({ sessions, scenarioData, loading }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getYAxisDomainMax = (maxValue: number) => {
    const safeMax = Math.max(maxValue, 0);

    if (safeMax === 0) {
      return 1;
    }

    const target = safeMax * 1.2;
    const magnitude = Math.pow(10, Math.floor(Math.log10(safeMax)));
    const step = Math.max(1, magnitude / 5);

    return Math.ceil(target / step) * step;
  };

  // Calculate JPY equivalent balance using FX rates
  const calculateJPYEquivalent = (balances: Record<string, number>, rates: Record<string, number>) => {
    let total = balances.JPY || 0;
    
    // Convert other currencies to JPY
    if (balances.USD && rates['USD/JPY']) {
      total += balances.USD * rates['USD/JPY'];
    }
    if (balances.EUR && rates['EUR/JPY']) {
      total += balances.EUR * rates['EUR/JPY'];
    }
    if (balances.AUD && rates['AUD/JPY']) {
      total += balances.AUD * rates['AUD/JPY'];
    }
    if (balances.HKD && rates['HKD/JPY']) {
      total += balances.HKD * rates['HKD/JPY'];
    }
    
    return total;
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (sessions.length === 0 || !scenarioData) return [];

    // Get all unique dates from all sessions
    const allDates = new Set<string>();
    sessions.forEach(session => {
      Object.keys(session.dateToBalances).forEach(date => allDates.add(date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint: any = { date };
      
      sessions.forEach(session => {
        const balances = session.dateToBalances[date];
        const rates = scenarioData.dateToCurrencyPairToRate[date];
        
        if (balances && rates) {
          const jpyEquivalent = calculateJPYEquivalent(balances, rates);
          dataPoint[`Session ${session.sessionId}`] = jpyEquivalent;
        }
      });

      return dataPoint;
    });
  }, [sessions, scenarioData]);

  // Calculate Y-axis domain with a rounded upper bound and zero start
  const yAxisDomain = React.useMemo(() => {
    if (chartData.length === 0 || sessions.length === 0) {
      return ['dataMin', 'dataMax'];
    }

    let min = Infinity;
    let max = -Infinity;

    chartData.forEach(dataPoint => {
      sessions.forEach(session => {
        const value = dataPoint[`Session ${session.sessionId}`];
        if (typeof value === 'number') {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    if (min === Infinity || max === -Infinity) {
      return ['dataMin', 'dataMax'];
    }

    const domainMin = 0;
    const domainMax = getYAxisDomainMax(max);

    return [domainMin, domainMax];
  }, [chartData, sessions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0 || chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-slate-300 rounded"></div>
          </div>
          <p className="text-slate-600 mb-2">No data to display</p>
          <p className="text-sm text-slate-500">Select sessions to view chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            domain={yAxisDomain}
            tickCount={5}
            tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name
            ]}
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {sessions.map((session, index) => (
            <Line
              key={session.sessionId}
              type="monotone"
              dataKey={`Session ${session.sessionId}`}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionChart;