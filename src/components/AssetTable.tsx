import React from 'react';
import { SessionDetail, ScenarioData } from '../types/api';
import { calculateJPYEquivalent, formatCurrency, SUPPORTED_CURRENCIES } from '../utils/currency';
import { formatDateTimeUtc } from '../utils/datetime';

interface AssetTableProps {
  sessions: SessionDetail[];
  scenarioData: ScenarioData | null;
  loading: boolean;
}

const AssetTable: React.FC<AssetTableProps> = ({ sessions, scenarioData, loading }) => {
  // Get the most recent 2 sessions
  const recentSessions = sessions.slice(-2);
  
  const formatDateTime = (dateStr: string) => {
    return formatDateTimeUtc(dateStr);
  };

  // Calculate JPY equivalent total using FX rates
  const calculateJPYEquivalentTotal = (balances: Record<string, number>, date: string) => {
    if (!scenarioData || !scenarioData.dateToCurrencyPairToRate[date]) {
      return null;
    }

    return calculateJPYEquivalent(
      balances,
      scenarioData.dateToCurrencyPairToRate[date],
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Asset Balances by Currency</h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading balances...</p>
          </div>
        </div>
      </div>
    );
  }

  if (recentSessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Asset Balances by Currency</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 border border-slate-300 rounded"></div>
          </div>
          <p className="text-slate-600 mb-1">No sessions selected</p>
          <p className="text-sm text-slate-500">Select sessions to view asset balances</p>
        </div>
      </div>
    );
  }

  // Get all unique dates from the recent sessions
  const allDates = new Set<string>();
  recentSessions.forEach(session => {
    Object.keys(session.dateToBalances).forEach(date => allDates.add(date));
  });
  const sortedDates = Array.from(allDates).sort();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Asset Balances by Currency</h3>
        <p className="text-sm text-slate-600">
          Showing data from {recentSessions.length} most recent selected session{recentSessions.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-8">
        {recentSessions.map(session => (
          <div key={session.sessionId}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">
                Session {session.sessionId}
              </h4>
              <span className="text-sm text-slate-500">
                {session.startDate} to {session.endDate}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                    {SUPPORTED_CURRENCIES.map(currency => (
                      <th key={currency} className="text-right py-3 px-4 font-medium text-slate-700">
                        {currency}
                      </th>
                    ))}
                    <th className="text-right py-3 px-4 font-medium text-slate-700 bg-blue-50">
                      JPY Equivalent Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDates.map(date => {
                    const balances = session.dateToBalances[date];
                    if (!balances) return null;

                    const jpyEquivalentTotal = calculateJPYEquivalentTotal(balances, date);

                    return (
                      <tr key={date} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          {formatDateTime(date)}
                        </td>
                        {SUPPORTED_CURRENCIES.map(currency => (
                          <td key={currency} className="py-3 px-4 text-sm text-right text-slate-700">
                            {balances[currency] !== undefined ? (
                              <span className={balances[currency] === 0 ? 'text-slate-400' : ''}>
                                {formatCurrency(balances[currency], currency)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-sm text-right font-semibold bg-blue-50">
                          {jpyEquivalentTotal !== null ? (
                            <span className="text-blue-900">
                              {formatCurrency(jpyEquivalentTotal, 'JPY')}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetTable;
