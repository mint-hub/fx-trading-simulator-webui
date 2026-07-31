import { SessionInfo, SessionDetail, ScenarioData } from '../types/api';

// Mock API data - used when API_BASE_URL is not configured
const mockSessionsData: Record<string, SessionInfo[]> = {
  'user123': [
    {
      sessionId: 9822,
      startDate: "2016-01-04",
      endDate: "2016-01-11",
      jpyBalance: 1002842,
      scenario: "TEST0",
      complete: false
    },
    {
      sessionId: 9490,
      startDate: "2016-01-04",
      endDate: "2016-01-11",
      jpyBalance: 999945.7663383546,
      scenario: "TEST0",
      complete: true
    },
    {
      sessionId: 9491,
      startDate: "2016-01-12",
      endDate: "2016-01-19",
      jpyBalance: 1009073.56,
      scenario: "TEST1",
      complete: true
    },
    {
      sessionId: 9492,
      startDate: "2016-01-20",
      endDate: "2016-01-27",
      jpyBalance: 999999.43,
      scenario: "TEST1",
      complete: true
    },
    {
      sessionId: 9493,
      startDate: "2016-02-03",
      endDate: "2016-02-10",
      jpyBalance: 999945.43,
      scenario: "EVAL0",
      complete: true
    },
    {
      sessionId: 9496,
      startDate: "2016-01-20",
      endDate: "2016-01-27",
      jpyBalance: 999999.43,
      scenario: "TEST1",
      complete: true
    },
    {
      sessionId: 9498,
      startDate: "2016-02-17",
      endDate: "2016-02-24",
      jpyBalance: 999819.43,
      scenario: "EVAL1",
      complete: true
    }
  ]
};

const mockSessionDetails: Record<number, SessionDetail> = {
  9822: {
    sessionId: 9822,
    startDate: "2016-01-04",
    endDate: "2016-01-11",
    jpyBalance: 1002842,
    scenario: "TEST0",
    dateToBalances: {
      "2016-01-04": { JPY: 1000000, EUR: 0, HKD: 0, USD: 0, AUD: 0 },
      "2016-01-05": { JPY: 998500, EUR: 0, HKD: 0, USD: 12.5, AUD: 8.2 },
      "2016-01-06": { JPY: 997000, EUR: 0, HKD: 0, USD: 25.1, AUD: 16.8 },
      "2016-01-07": { JPY: 995500, EUR: 0, HKD: 0, USD: 37.8, AUD: 25.5 },
      "2016-01-08": { JPY: 994000, EUR: 0, HKD: 0, USD: 50.2, AUD: 34.1 }
    },
    complete: false
  },
  9490: {
    sessionId: 9490,
    startDate: "2016-01-04",
    endDate: "2016-01-11",
    jpyBalance: 999945.7663383546,
    scenario: "TEST0",
    dateToBalances: {
      "2016-01-04": { JPY: 1000000, EUR: 0, HKD: 0, USD: 0, AUD: 0 },
      "2016-01-05": { JPY: 998000, EUR: 0, HKD: 0, USD: 8.30564784053156, AUD: 11.415525114155253 },
      "2016-01-06": { JPY: 996000, EUR: 0, HKD: 0, USD: 16.689985897042, AUD: 23.08277514332338 },
      "2016-01-07": { JPY: 994000, EUR: 0, HKD: 0, USD: 25.0905235314506, AUD: 34.79923677191155 },
      "2016-01-08": { JPY: 992000, EUR: 0, HKD: 0, USD: 33.517963275256434, AUD: 46.713927585684935 },
      "2016-01-11": { JPY: 990000, EUR: 0, HKD: 0, USD: 42.0026060717947, AUD: 58.78102062297225 }
    },
    complete: true
  },
  9491: {
    sessionId: 9491,
    startDate: "2016-01-12",
    endDate: "2016-01-19",
    jpyBalance: 1009073.56,
    scenario: "TEST1",
    dateToBalances: {
      "2016-01-12": { JPY: 1000000, EUR: 15.5, HKD: 0, USD: 0, AUD: 0 },
      "2016-01-13": { JPY: 998500, EUR: 31.2, HKD: 0, USD: 5.5, AUD: 0 },
      "2016-01-14": { JPY: 997000, EUR: 47.8, HKD: 0, USD: 11.2, AUD: 7.8 },
      "2016-01-15": { JPY: 995500, EUR: 64.1, HKD: 0, USD: 16.8, AUD: 15.6 },
      "2016-01-19": { JPY: 994000, EUR: 80.5, HKD: 0, USD: 22.4, AUD: 23.4 }
    },
    complete: true
  },
  9492: {
    sessionId: 9492,
    startDate: "2016-01-20",
    endDate: "2016-01-27",
    jpyBalance: 999999.43,
    scenario: "TEST1",
    dateToBalances: {
      "2016-01-20": { JPY: 1000000, EUR: 0, HKD: 12.5, USD: 0, AUD: 0 },
      "2016-01-21": { JPY: 998000, EUR: 8.2, HKD: 25.8, USD: 3.1, AUD: 0 },
      "2016-01-22": { JPY: 996000, EUR: 16.5, HKD: 39.2, USD: 6.3, AUD: 4.7 },
      "2016-01-25": { JPY: 994000, EUR: 24.8, HKD: 52.6, USD: 9.4, AUD: 9.4 },
      "2016-01-27": { JPY: 992000, EUR: 33.1, HKD: 66.0, USD: 12.6, AUD: 14.1 }
    },
    complete: true
  },
  9493: {
    sessionId: 9493,
    startDate: "2016-02-03",
    endDate: "2016-02-10",
    jpyBalance: 999945.43,
    scenario: "EVAL0",
    dateToBalances: {
      "2016-02-03": { JPY: 1000000, EUR: 0, HKD: 0, USD: 0, AUD: 0 },
      "2016-02-04": { JPY: 998000, EUR: 0, HKD: 0, USD: 8.30564784053156, AUD: 11.415525114155253 },
      "2016-02-05": { JPY: 996000, EUR: 0, HKD: 0, USD: 16.689985897042, AUD: 23.08277514332338 },
      "2016-02-06": { JPY: 994000, EUR: 0, HKD: 0, USD: 25.0905235314506, AUD: 34.79923677191155 },
      "2016-02-07": { JPY: 992000, EUR: 0, HKD: 0, USD: 33.517963275256434, AUD: 46.713927585684935 },
      "2016-02-10": { JPY: 990000, EUR: 0, HKD: 0, USD: 42.0026060717947, AUD: 58.78102062297225 }
    },
    complete: true
  },
  9496: {
    sessionId: 9496,
    startDate: "2016-01-20",
    endDate: "2016-01-27",
    jpyBalance: 999999.43,
    scenario: "TEST1",
    dateToBalances: {
      "2016-01-20": { JPY: 1000000, EUR: 0, HKD: 25.0, USD: 0, AUD: 0 },
      "2016-01-21": { JPY: 996000, EUR: 16.4, HKD: 51.6, USD: 6.2, AUD: 0 },
      "2016-01-22": { JPY: 992000, EUR: 33.0, HKD: 78.4, USD: 12.6, AUD: 9.4 },
      "2016-01-25": { JPY: 988000, EUR: 49.6, HKD: 105.2, USD: 18.8, AUD: 18.8 },
      "2016-01-27": { JPY: 984000, EUR: 66.2, HKD: 132.0, USD: 25.2, AUD: 28.2 }
    },
    complete: true
  },
  9498: {
    sessionId: 9498,
    startDate: "2016-02-17",
    endDate: "2016-02-24",
    jpyBalance: 999819.43,
    scenario: "EVAL1",
    dateToBalances: {
      "2016-02-17": { JPY: 1000000, EUR: 0, HKD: 0, USD: 0, AUD: 0 },
      "2016-02-18": { JPY: 998000, EUR: 0, HKD: 0, USD: 8.30564784053156, AUD: 11.415525114155253 },
      "2016-02-19": { JPY: 996000, EUR: 0, HKD: 0, USD: 16.689985897042, AUD: 23.08277514332338 },
      "2016-02-20": { JPY: 994000, EUR: 0, HKD: 0, USD: 25.0905235314506, AUD: 34.79923677191155 },
      "2016-02-21": { JPY: 992000, EUR: 0, HKD: 0, USD: 33.517963275256434, AUD: 46.713927585684935 },
      "2016-02-24": { JPY: 990000, EUR: 0, HKD: 0, USD: 42.0026060717947, AUD: 58.78102062297225 }
    },
    complete: true
  },
};

const mockScenarioData: Record<string, ScenarioData> = {
  TEST0: {
    startDate: '2016-01-04',
    endDate: '2016-01-11',
    dateToCurrencyPairToRate: {
      '2016-01-04': { 'USD/JPY': 118.2, 'EUR/JPY': 129.4, 'AUD/JPY': 85.1, 'HKD/JPY': 15.2 },
      '2016-01-05': { 'USD/JPY': 118.6, 'EUR/JPY': 129.8, 'AUD/JPY': 85.4, 'HKD/JPY': 15.25 },
      '2016-01-06': { 'USD/JPY': 119.0, 'EUR/JPY': 130.1, 'AUD/JPY': 85.7, 'HKD/JPY': 15.3 },
      '2016-01-07': { 'USD/JPY': 118.9, 'EUR/JPY': 129.7, 'AUD/JPY': 85.5, 'HKD/JPY': 15.28 },
      '2016-01-08': { 'USD/JPY': 118.4, 'EUR/JPY': 129.2, 'AUD/JPY': 85.0, 'HKD/JPY': 15.18 },
      '2016-01-11': { 'USD/JPY': 118.1, 'EUR/JPY': 129.0, 'AUD/JPY': 84.8, 'HKD/JPY': 15.15 },
    },
  },
  TEST1: {
    startDate: '2016-01-12',
    endDate: '2016-01-27',
    dateToCurrencyPairToRate: {
      '2016-01-12': { 'USD/JPY': 118.0, 'EUR/JPY': 128.8, 'AUD/JPY': 84.6, 'HKD/JPY': 15.1 },
      '2016-01-13': { 'USD/JPY': 117.7, 'EUR/JPY': 128.4, 'AUD/JPY': 84.4, 'HKD/JPY': 15.08 },
      '2016-01-14': { 'USD/JPY': 117.9, 'EUR/JPY': 128.7, 'AUD/JPY': 84.5, 'HKD/JPY': 15.09 },
      '2016-01-15': { 'USD/JPY': 118.3, 'EUR/JPY': 129.1, 'AUD/JPY': 84.9, 'HKD/JPY': 15.14 },
      '2016-01-19': { 'USD/JPY': 118.5, 'EUR/JPY': 129.5, 'AUD/JPY': 85.2, 'HKD/JPY': 15.18 },
      '2016-01-20': { 'USD/JPY': 118.7, 'EUR/JPY': 129.6, 'AUD/JPY': 85.3, 'HKD/JPY': 15.2 },
      '2016-01-21': { 'USD/JPY': 118.9, 'EUR/JPY': 129.9, 'AUD/JPY': 85.6, 'HKD/JPY': 15.23 },
      '2016-01-22': { 'USD/JPY': 119.1, 'EUR/JPY': 130.2, 'AUD/JPY': 85.8, 'HKD/JPY': 15.26 },
      '2016-01-25': { 'USD/JPY': 119.0, 'EUR/JPY': 130.0, 'AUD/JPY': 85.7, 'HKD/JPY': 15.24 },
      '2016-01-27': { 'USD/JPY': 118.8, 'EUR/JPY': 129.7, 'AUD/JPY': 85.5, 'HKD/JPY': 15.21 },
    },
  },
  EVAL0: {
    startDate: '2016-02-03',
    endDate: '2016-02-10',
    dateToCurrencyPairToRate: {
      '2016-02-03': { 'USD/JPY': 118.2, 'EUR/JPY': 129.4, 'AUD/JPY': 85.1, 'HKD/JPY': 15.2 },
      '2016-02-04': { 'USD/JPY': 118.6, 'EUR/JPY': 129.8, 'AUD/JPY': 85.4, 'HKD/JPY': 15.25 },
      '2016-02-05': { 'USD/JPY': 119.0, 'EUR/JPY': 130.1, 'AUD/JPY': 85.7, 'HKD/JPY': 15.3 },
      '2016-02-06': { 'USD/JPY': 118.9, 'EUR/JPY': 129.7, 'AUD/JPY': 85.5, 'HKD/JPY': 15.28 },
      '2016-02-07': { 'USD/JPY': 118.4, 'EUR/JPY': 129.2, 'AUD/JPY': 85.0, 'HKD/JPY': 15.18 },
      '2016-02-10': { 'USD/JPY': 118.1, 'EUR/JPY': 129.0, 'AUD/JPY': 84.8, 'HKD/JPY': 15.15 },
    },
  },
  EVAL1: {
    startDate: '2016-02-17',
    endDate: '2016-02-24',
    dateToCurrencyPairToRate: {
      '2016-02-17': { 'USD/JPY': 115.2, 'EUR/JPY': 129.4, 'AUD/JPY': 85.1, 'HKD/JPY': 15.2 },
      '2016-02-18': { 'USD/JPY': 115.6, 'EUR/JPY': 129.8, 'AUD/JPY': 85.4, 'HKD/JPY': 15.25 },
      '2016-02-19': { 'USD/JPY': 116.0, 'EUR/JPY': 130.1, 'AUD/JPY': 85.7, 'HKD/JPY': 15.3 },
      '2016-02-20': { 'USD/JPY': 115.9, 'EUR/JPY': 129.7, 'AUD/JPY': 85.5, 'HKD/JPY': 15.28 },
      '2016-02-21': { 'USD/JPY': 115.4, 'EUR/JPY': 129.2, 'AUD/JPY': 85.0, 'HKD/JPY': 15.18 },
      '2016-02-24': { 'USD/JPY': 115.1, 'EUR/JPY': 129.0, 'AUD/JPY': 84.8, 'HKD/JPY': 15.15 },
    },
  },
};


export const fetchUserSessions = async (userId: string): Promise<SessionInfo[]> => {
  // Use mock data for user123
  if (userId === 'user123') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSessionsData[userId] || [];
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check if API base URL is configured (empty string means use relative path)
  if (apiBaseUrl !== undefined) {
    try {
      // Use API base URL (empty string = relative path for Netlify proxy)
      const response = await fetch(`${apiBaseUrl}/api/trade/sessions/userId/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch from backend, falling back to empty array:', error);
      return [];
    }
  }

  // No backend configured
  return [];
};

export const fetchSessionDetail = async (sessionId: number): Promise<SessionDetail> => {
  // Use mock data for specific session IDs (user123's sessions)
  if (mockSessionDetails[sessionId]) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSessionDetails[sessionId];
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check if API base URL is configured (empty string means use relative path)
  if (apiBaseUrl !== undefined) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/trade/session/sessionId/${sessionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch from backend:', error);
      throw new Error(`Session ${sessionId} not found`);
    }
  }

  throw new Error(`Session ${sessionId} not found`);
};

export const fetchScenarioData = async (scenario: string): Promise<ScenarioData> => {
  if (mockScenarioData[scenario]) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockScenarioData[scenario];
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check if API base URL is configured (empty string means use relative path)
  if (apiBaseUrl !== undefined) {
    try {
      // Use API base URL (empty string = relative path for Netlify proxy)
      const response = await fetch(`${apiBaseUrl}/api/trade/scenario/${scenario}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch from backend:', error);
      throw new Error(`Scenario ${scenario} not found`);
    }
  }

  throw new Error(`Scenario ${scenario} not found`);
};