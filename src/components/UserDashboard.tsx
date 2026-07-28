import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, RefreshCw } from 'lucide-react';
import { SessionInfo, SessionDetail, ScenarioData } from '../types/api';
import { fetchUserSessions, fetchSessionDetail, fetchScenarioData } from '../utils/api';
import SessionList from './SessionList';
import SessionChart from './SessionChart';
import FXRatesChart from './FXRatesChart';
import AssetTable from './AssetTable';

const UserDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [scenarioFilter, setScenarioFilter] = useState<'Evaluation' | 'Test'>('Test');
  const [sessionDetails, setSessionDetails] = useState<SessionDetail[]>([]);
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const sessionsData = await fetchUserSessions(userId);
        setSessions(sessionsData);
      } catch (err) {
        setError('Failed to load sessions');
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [userId]);

  // Load scenario data for the selected scenario
  useEffect(() => {
    const loadScenarioData = async () => {
      if (!selectedScenario) {
        setScenarioData(null);
        return;
      }

      try {
        setScenarioLoading(true);
        const data = await fetchScenarioData(selectedScenario);
        setScenarioData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading scenario data:', err);
        setError('Failed to load scenario data');
      } finally {
        setScenarioLoading(false);
      }
    };

    loadScenarioData();
  }, [selectedScenario]);

  // Load session details when selected sessions change
  useEffect(() => {
    const loadSessionDetails = async () => {
      if (selectedSessions.length === 0) {
        setSessionDetails([]);
        return;
      }

      try {
        setDetailsLoading(true);
        const details = await Promise.all(
          selectedSessions.map(sessionId => fetchSessionDetail(sessionId))
        );
        setSessionDetails(details);
      } catch (err) {
        console.error('Error loading session details:', err);
        setError('Failed to load session details');
      } finally {
        setDetailsLoading(false);
      }
    };

    loadSessionDetails();
  }, [selectedSessions]);

  const handleSessionSelect = (sessionId: number) => {
    const clickedSession = sessions.find(session => session.sessionId === sessionId);
    if (!clickedSession) {
      return;
    }

    if (selectedScenario && selectedScenario !== clickedSession.scenario) {
      setSelectedScenario(clickedSession.scenario);
      setSelectedSessions([sessionId]);
      return;
    }

    setSelectedScenario(clickedSession.scenario);
    setSelectedSessions(prev => {
      if (prev.includes(sessionId)) {
        const nextSessions = prev.filter(id => id !== sessionId);
        if (nextSessions.length === 0) {
          setSelectedScenario(null);
        }
        return nextSessions;
      }

      return [...prev, sessionId];
    });
  };

  const handleScenarioToggle = (scenario: string) => {
    setExpandedScenario(prev => (prev === scenario ? null : scenario));
    setSelectedScenario(null);
    setSelectedSessions([]);
    setSessionDetails([]);
    setScenarioData(null);
  };

  const handleScenarioFilterChange = (nextFilter: 'Evaluation' | 'Test') => {
    setScenarioFilter(nextFilter);
    setExpandedScenario(null);
    setSelectedScenario(null);
    setSelectedSessions([]);
    setSessionDetails([]);
    setScenarioData(null);
  };

  const handleRefresh = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await fetchUserSessions(userId);
      setSessions(sessionsData);
    } catch (err) {
      setError('Failed to refresh sessions');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Invalid user ID</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Trading Dashboard
                </h1>
                <p className="text-sm text-slate-600">User: {userId}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Session List */}
        <div className="w-96 bg-white border-r border-slate-200 flex-shrink-0">
          <SessionList
            sessions={sessions}
            selectedSessions={selectedSessions}
            selectedScenario={selectedScenario}
            expandedScenario={expandedScenario}
            scenarioFilter={scenarioFilter}
            onScenarioFilterChange={handleScenarioFilterChange}
            onScenarioToggle={handleScenarioToggle}
            onSessionSelect={handleSessionSelect}
            loading={loading}
          />
        </div>

        {/* Right Panel - Charts and Tables */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Charts Section - Split Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* JPY Equivalent Balance Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  JPY Equivalent Balance Over Time
                </h3>
                <SessionChart 
                  sessions={sessionDetails}
                  scenarioData={scenarioData}
                  loading={detailsLoading || scenarioLoading}
                />
              </div>

              {/* FX Rates Chart */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  FX Rates Over Time
                </h3>
                <FXRatesChart 
                  scenarioData={scenarioData}
                  loading={scenarioLoading}
                  selectedScenario={selectedScenario}
                />
              </div>
            </div>

            {/* Asset Table Section */}
            <AssetTable
              sessions={sessionDetails}
              scenarioData={scenarioData}
              loading={detailsLoading || scenarioLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;