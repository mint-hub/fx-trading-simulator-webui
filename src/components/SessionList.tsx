import React, { useMemo } from 'react';
import { SessionInfo } from '../types/api';
import { Calendar, ChevronDown, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface SessionListProps {
  sessions: SessionInfo[];
  selectedSessions: number[];
  selectedScenario: string | null;
  expandedScenario: string | null;
  scenarioFilter: 'Test' | 'Evaluation';
  onScenarioFilterChange: (scenarioFilter: 'Test' | 'Evaluation') => void;
  onScenarioToggle: (scenario: string) => void;
  onSessionSelect: (sessionId: number) => void;
  loading: boolean;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  selectedSessions,
  selectedScenario,
  expandedScenario,
  scenarioFilter,
  onScenarioFilterChange,
  onScenarioToggle,
  onSessionSelect,
  loading
}) => {
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const isEvaluationScenario = session.scenario.includes('EVAL');
      return scenarioFilter === 'Evaluation' ? isEvaluationScenario : !isEvaluationScenario;
    });
  }, [sessions, scenarioFilter]);

  const sessionsByScenario = useMemo(() => {
    return filteredSessions.reduce((acc, session) => {
      if (!acc[session.scenario]) {
        acc[session.scenario] = [];
      }
      acc[session.scenario].push(session);
      return acc;
    }, {} as Record<string, SessionInfo[]>);
  }, [filteredSessions]);

  const scenarios = useMemo(() => Object.keys(sessionsByScenario), [sessionsByScenario]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">No trading sessions found</p>
          <p className="text-sm text-slate-500">Please submit first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Trading Sessions</h2>
        <p className="mt-1 text-sm text-slate-500">Switch between Evaluation and Test, then click a scenario card to expand or collapse it.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['Test', 'Evaluation'] as const).map(filter => {
            const isActive = scenarioFilter === filter;
            const isEvaluation = filter === 'Evaluation';
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onScenarioFilterChange(filter)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${isActive ? (isEvaluation ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {scenarioFilter === 'Evaluation' && (
          <div className="px-2 py-1 text-sm text-red-700">
            In Evaluation, if a scenario has multiple sessions, the oldest one will be used for the leaderboard.
          </div>
        )}

        {scenarios.map(scenario => {
          const isExpanded = expandedScenario === scenario;
          const isActiveScenario = selectedScenario === scenario;
          const scenarioSessions = sessionsByScenario[scenario] || [];
          const isEvaluationScenario = scenario.includes('EVAL');
          const isEvaluationFilter = scenarioFilter === 'Evaluation';
          const themeIsRed = isEvaluationFilter && isEvaluationScenario;
          const cardBorderClass = themeIsRed
            ? (isActiveScenario ? 'border-red-500 bg-red-50/40 shadow-sm' : 'border-red-300 bg-white')
            : (isActiveScenario ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-white');
          const headerActivePillClass = themeIsRed
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700';
          const sessionCardClass = themeIsRed
            ? (isSelected: boolean) => isSelected
              ? 'border-red-500 bg-red-50 shadow-sm'
              : 'border-red-200 bg-white hover:border-red-300 hover:shadow-sm'
            : (isSelected: boolean) => isSelected
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm';

          return (
            <div
              key={scenario}
              className={`rounded-xl border transition-colors ${cardBorderClass}`}
            >
              <button
                type="button"
                onClick={() => onScenarioToggle(scenario)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{scenario}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {scenarioSessions.length} sessions
                    </span>
                    {isActiveScenario && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${headerActivePillClass}`}>
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Click a session chip to load its graph</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="border-t border-slate-200 p-4 space-y-3">
                  {scenarioSessions.map(session => {
                    const isSelected = selectedSessions.includes(session.sessionId);
                    const profit = session.jpyBalance - 1000000;
                    const isProfit = profit > 0;
                    const currentSessionCardClass = sessionCardClass(isSelected);

                    return (
                      <button
                        key={session.sessionId}
                        type="button"
                        onClick={() => onSessionSelect(session.sessionId)}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${currentSessionCardClass}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">Session {session.sessionId}</span>
                              {session.complete ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(session.startDate)} - {formatDate(session.endDate)}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-slate-900">{formatCurrency(session.jpyBalance)}</div>
                            <div className={`mt-1 flex items-center justify-end gap-1 text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                              {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              <span>{isProfit ? '+' : ''}{formatCurrency(profit)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {scenarios.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>No sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;