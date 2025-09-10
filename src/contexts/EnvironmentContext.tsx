import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Environment } from '@/components';

interface EnvironmentContextType {
  selectedEnvironment: Environment;
  setSelectedEnvironment: (environment: Environment) => void;
  detectedProduction: string | null;
  setDetectedProduction: (hostname: string | null) => void;
  getCurrentApiBaseUrl: () => string;
  isProductionEnvironment: boolean;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

const DEFAULT_ENVIRONMENT: Environment = {
  id: 'qa2',
  name: 'QA2 - Desenvolvimento',
  url: 'qa2.theos.com.br',
  type: 'development',
  description: 'Ambiente de testes e desenvolvimento'
};

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment>(DEFAULT_ENVIRONMENT);
  const [detectedProduction, setDetectedProduction] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('eclesial_selected_environment');
    if (saved) {
      const env = getAvailableEnvironments().find(e => e.id === saved);
      if (env) {
        setSelectedEnvironment(env);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eclesial_selected_environment', selectedEnvironment.id);
  }, [selectedEnvironment]);

  useEffect(() => {
    const savedProduction = localStorage.getItem('eclesial_detected_production');
    if (savedProduction) {
      setDetectedProduction(savedProduction);
    }
  }, []);

  const setDetectedProductionWithStorage = (hostname: string | null) => {
    
    if (hostname) {
      localStorage.setItem('eclesial_detected_production', hostname);
    } else {
      localStorage.removeItem('eclesial_detected_production');
    }
    
    setDetectedProduction(hostname);
  };

  const getAvailableEnvironments = (): Environment[] => [
    {
      id: 'qa2',
      name: 'QA2 - Desenvolvimento',
      url: 'qa2.theos.com.br',
      type: 'development',
      description: 'Ambiente de testes e desenvolvimento'
    },
    {
      id: 'eclesial',
      name: 'Eclesial - Staging',
      url: 'eclesial.theos.com.br',
      type: 'staging',
      description: 'Ambiente de homologação e testes finais'
    },
    {
      id: 'developer',
      name: 'Developer - Staging',
      url: 'developer.theos.com.br',
      type: 'staging',
      description: 'Ambiente para desenvolvedores'
    },
    {
      id: 'hotfix',
      name: 'Hotfix - Staging',
      url: 'hotfix.theos.com.br',
      type: 'staging',
      description: 'Ambiente para correções urgentes'
    }
  ];

  const getCurrentApiBaseUrl = (): string => {
    if (detectedProduction && isProductionHostname(detectedProduction)) {
      return `https://${detectedProduction}.theos.com.br`;
    }
    
    return `https://${selectedEnvironment.url}`;
  };

  const isProductionHostname = (hostname: string): boolean => {
    return hostname.toLowerCase().startsWith('producao');
  };

  const isProductionEnvironment = detectedProduction && isProductionHostname(detectedProduction);

  const value: EnvironmentContextType = {
    selectedEnvironment,
    setSelectedEnvironment,
    detectedProduction,
    setDetectedProduction: setDetectedProductionWithStorage,
    getCurrentApiBaseUrl,
    isProductionEnvironment
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};
