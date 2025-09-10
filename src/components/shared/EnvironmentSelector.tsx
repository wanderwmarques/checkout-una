
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { eclesialApi } from '@/services/eclesialApi';

export interface Environment {
  id: string;
  name: string;
  url: string;
  type: 'development' | 'staging' | 'production';
  description: string;
}

const AVAILABLE_ENVIRONMENTS: Environment[] = [
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

export const EnvironmentSelector = () => {
  const { 
    selectedEnvironment, 
    setSelectedEnvironment 
  } = useEnvironment();

  const handleEnvironmentChange = (environmentId: string) => {
    const env = AVAILABLE_ENVIRONMENTS.find(e => e.id === environmentId);
    if (env) {
      
      setSelectedEnvironment(env);
      
      eclesialApi.updateApiBaseUrl();
      
      setTimeout(() => {
      }, 100);
    }
  };

  return (
    <div className="space-y-3">
      {/* Seletor de Ambiente */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">🌍 Ambiente:</label>
        <Select value={selectedEnvironment.id} onValueChange={handleEnvironmentChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um ambiente" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_ENVIRONMENTS.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                <div className="flex items-center gap-2">
                  <span>{env.name}</span>
                  <span className="text-xs text-slate-500">({env.url})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
