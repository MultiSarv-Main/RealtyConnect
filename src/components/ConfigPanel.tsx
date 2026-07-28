/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  HardDrive, 
  History, 
  Info,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { SystemConfig } from '../types';

interface ConfigPanelProps {
  configs: SystemConfig[];
  onConfigChanged: (key: string, newValue: string) => void;
  userSession: { email: string; role: string; permissions: string[] } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ConfigPanel({ configs, onConfigChanged, userSession, showToast }: ConfigPanelProps) {
  
  const handleToggle = (config: SystemConfig) => {
    // RBAC validation
    const canManage = userSession?.permissions.includes('MANAGE_SYSTEM_CONFIGS');
    if (!canManage) {
      showToast('Security Alert: 403 Forbidden. Only users holding MANAGE_SYSTEM_CONFIGS permission (ADMIN role) are authorized to modify global runtime system parameters.', 'error');
      return;
    }

    const currentVal = config.value === 'true';
    const nextVal = (!currentVal).toString();
    onConfigChanged(config.key, nextVal);
  };

  const handleNumberChange = (config: SystemConfig, delta: number) => {
    // RBAC validation
    const canManage = userSession?.permissions.includes('MANAGE_SYSTEM_CONFIGS');
    if (!canManage) {
      showToast('Security Alert: 403 Forbidden. Access Denied. MANAGE_SYSTEM_CONFIGS required.', 'error');
      return;
    }

    const currentVal = parseInt(config.value, 10);
    const nextVal = Math.max(1, currentVal + delta).toString();
    onConfigChanged(config.key, nextVal);
  };

  const getIconForCategory = (category: SystemConfig['category']) => {
    switch (category) {
      case 'Security':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Storage':
        return <HardDrive className="w-4 h-4 text-emerald-400" />;
      case 'Logging':
        return <History className="w-4 h-4 text-emerald-400" />;
      default:
        return <Settings className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col justify-between" id="global-config-panel">
      <div>
        <div className="pb-3 border-b border-slate-900 flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              Global Environment Variables & Configs
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Read-write sandbox parameters controlling active guardrails across the platform.
            </p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 font-mono font-bold rounded uppercase">
            Active
          </span>
        </div>

        {/* Configuration Parameter Rows */}
        <div className="mt-4 space-y-3">
          {configs.map(config => {
            const isBoolean = config.type === 'boolean';
            const isTrue = config.value === 'true';
            
            return (
              <div 
                key={config.key}
                id={`config-row-${config.key}`}
                className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800 mt-0.5">
                    {getIconForCategory(config.category)}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-200 block">{config.key}</span>
                    <span className="text-xs text-slate-400 mt-0.5 block leading-relaxed">{config.description}</span>
                  </div>
                </div>

                {/* Control elements */}
                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  {isBoolean ? (
                    <button
                      onClick={() => handleToggle(config)}
                      id={`btn-toggle-config-${config.key}`}
                      className="focus:outline-none transition-transform active:scale-95 text-slate-400 hover:text-emerald-400"
                    >
                      {isTrue ? (
                        <ToggleRight className="w-9 h-9 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-9 h-9 text-slate-650" />
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-1">
                      <button
                        onClick={() => handleNumberChange(config, -1)}
                        id={`btn-decrement-${config.key}`}
                        className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 font-mono text-xs font-bold text-slate-200">
                        {config.value}
                        {config.key.includes('SIZE') ? 'MB' : config.key.includes('DAYS') ? ' days' : ''}
                      </span>
                      <button
                        onClick={() => handleNumberChange(config, 1)}
                        id={`btn-increment-${config.key}`}
                        className="px-2 py-0.5 text-xs text-slate-400 hover:text-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warning notices */}
      <div className="mt-5 p-3.5 bg-slate-900/20 border border-slate-850 rounded-lg text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-slate-300">Reactive System Sync</p>
          <p className="mt-0.5">Enabling <strong>MAINTENANCE_MODE</strong> immediately blocks authentication for all non-administrators. Adjusting <strong>MAX_UPLOAD_SIZE_MB</strong> will dynamically restrict document uploads.</p>
        </div>
      </div>
    </div>
  );
}
