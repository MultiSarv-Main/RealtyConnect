/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Terminal, 
  Settings, 
  File, 
  Bell, 
  Lock, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle,
  History,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  X
} from 'lucide-react';

import { AuditLog, SystemConfig, SystemNotification } from './types';
import LandingPortal from './components/LandingPortal';

const DocViewer = React.lazy(() => import('./components/DocViewer'));
const AuthSimulator = React.lazy(() => import('./components/AuthSimulator'));
const MastersManager = React.lazy(() => import('./components/MastersManager'));
const ConfigPanel = React.lazy(() => import('./components/ConfigPanel'));
const FileUploader = React.lazy(() => import('./components/FileUploader'));
const NotificationSimulator = React.lazy(() => import('./components/NotificationSimulator'));
const LogsViewer = React.lazy(() => import('./components/LogsViewer'));
const RegistrationOnboarding = React.lazy(() => import('./components/RegistrationOnboarding'));

// Deterministic 64-char Hex Hash simulation for Rule LOG-02
function simulateSHA256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  let hex = Math.abs(hash).toString(16).padStart(8, '0');
  while (hex.length < 64) {
    hex += Math.abs((hash * (hex.length + 1)) % 16).toString(16);
  }
  return hex;
}

const INITIAL_CONFIGS: SystemConfig[] = [
  { key: 'MAINTENANCE_MODE', value: 'false', description: 'Restricts active system logins exclusively to accounts holding admin roles.', type: 'boolean', category: 'System' },
  { key: 'MAX_UPLOAD_SIZE_MB', value: '10', description: 'Maximum permissible individual binary size for the quarantine uploader.', type: 'number', category: 'Storage' },
  { key: 'BRUTE_FORCE_THRESHOLD', value: '5', description: 'Consecutive incorrect authentication attempts before account lock triggers.', type: 'number', category: 'Security' },
  { key: 'AUDIT_LOG_ROTATION_DAYS', value: '90', description: 'Interval threshold for retaining compliance and audit chains before archiving.', type: 'number', category: 'Logging' }
];

export default function App() {
  const [viewMode, setViewMode] = useState<'business' | 'onboarding' | 'foundation'>('business');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'auth' | 'masters' | 'config' | 'file' | 'noti' | 'logs'>('blueprint');
  const [userSession, setUserSession] = useState<{ 
    email: string; 
    role: string; 
    permissions: string[]; 
    subscriptionPlan?: string; 
    organizationName?: string; 
    reraRegistration?: string; 
  } | null>(null);
  const [configs, setConfigs] = useState<SystemConfig[]>(INITIAL_CONFIGS);
  
  // Decoupled notification state
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: 'n1', type: 'in_app', recipient: 'SYSTEM_OPERATOR', content: 'Platform Foundation container booted successfully on port 3000.', status: 'sent', timestamp: '2026-07-16 07:10' }
  ]);

  // Cryptographically chained compliance logs conforming to Rule LOG-01 and LOG-02
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'L-10001',
      timestamp: '2026-07-16 07:10:00',
      userId: 'SYSTEM',
      userRole: 'SYSTEM_OPERATOR',
      action: 'PLATFORM_DOCKER_BOOT',
      entity: 'servers',
      entityId: 'realtyconnect-foundation-v1',
      status: 'SUCCESS',
      details: 'Container image booted on port 3000. Reverse-proxy routing enabled.',
      ipAddress: '127.0.0.1',
      chainHash: simulateSHA256('L-10001:SYSTEM:PLATFORM_DOCKER_BOOT:realtyconnect-foundation-v1')
    }
  ]);

  // Active time state for top bar
  const [currentTime, setCurrentTime] = useState(new Date().toISOString().replace('T', ' ').substr(0, 19));

  // Stateful custom toast alert container (non-blocking for iframes)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Theme Management (Light / Dark Mode State and Persistence)
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('realtyconnect_theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('realtyconnect_theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('realtyconnect_theme', 'dark');
    }
  }, [isLightMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setTimeout(() => {
      setToast({ message, type });
    }, 0);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().replace('T', ' ').substr(0, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Central log trigger - appends and cryptographically chains next block
  const triggerLog = (
    action: string, 
    entity: string, 
    entityId: string, 
    status: 'SUCCESS' | 'FAILURE' | 'WARNING', 
    details: string
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
    const userId = userSession?.email || 'SYSTEM';
    const userRole = userSession?.role || 'SYSTEM_OPERATOR';
    const ipAddress = '10.240.12.84'; // Simulated private container subnet IP

    setLogs(prev => {
      const nextId = `L-${prev.length + 10002}`;
      const prevLog = prev[0]; // prev is sorted descending (newest first)
      const prevHash = prevLog?.chainHash || '00000000000000000000000000000000';
      
      const currentBlockData = `${prevHash}:${nextId}:${timestamp}:${userId}:${userRole}:${action}:${entity}:${entityId}:${status}:${details}`;
      const chainHash = simulateSHA256(currentBlockData);

      const newLog: AuditLog = {
        id: nextId,
        timestamp,
        userId,
        userRole,
        action,
        entity,
        entityId,
        status,
        details,
        ipAddress,
        chainHash
      };

      return [newLog, ...prev];
    });
  };

  // Central notification dispatcher
  const triggerNotification = (type: SystemNotification['type'], recipient: string, content: string) => {
    const notiId = `noti-${Math.random().toString(36).substr(2, 5)}`;
    const newNoti: SystemNotification = {
      id: notiId,
      type,
      recipient,
      content,
      status: 'queued',
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16)
    };

    setTimeout(() => {
      setNotifications(prev => [newNoti, ...prev]);
    }, 0);

    // Simulate async dispatch queue
    setTimeout(() => {
      setNotifications(prev => prev.map(n => {
        if (n.id === notiId) {
          return { ...n, status: 'sent' };
        }
        return n;
      }));
    }, 1500);
  };

  const handleConfigChange = (key: string, newValue: string) => {
    setConfigs(prev => prev.map(cfg => {
      if (cfg.key === key) {
        triggerLog(
          'GLOBAL_CONFIGURATION_UPDATED',
          'system_configs',
          key,
          'SUCCESS',
          `Modified global variable "${key}" value from "${cfg.value}" to "${newValue}".`
        );
        return { ...cfg, value: newValue };
      }
      return cfg;
    }));
  };

  // Seed default configurations on launch
  useEffect(() => {
    triggerLog('SYSTEM_CONFIGS_SEEDED', 'system_configs', 'all', 'SUCCESS', 'Seeded core Platform Foundation environment variables.');
  }, []);

  const maintenanceModeActive = configs.find(c => c.key === 'MAINTENANCE_MODE')?.value === 'true';
  const maxUploadSizeMb = parseInt(configs.find(c => c.key === 'MAX_UPLOAD_SIZE_MB')?.value || '10', 10);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {viewMode === 'business' ? (
        <div className="w-full min-h-screen flex flex-col">
          <LandingPortal 
            onLogTriggered={triggerLog}
            userSession={userSession}
            showToast={showToast}
            onToggleDevHub={() => setViewMode('foundation')}
            onStartOnboarding={() => setViewMode('onboarding')}
            isLightMode={isLightMode}
            onToggleTheme={() => setIsLightMode(prev => !prev)}
            onLogout={() => setUserSession(null)}
            onLogin={(email, role, permissions, subscriptionPlan, organizationName, reraRegistration) => 
              setUserSession({ email, role, permissions, subscriptionPlan, organizationName, reraRegistration })
            }
          />
        </div>
      ) : viewMode === 'onboarding' ? (
        <div className="w-full min-h-screen flex flex-col">
          <React.Suspense fallback={
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10" />
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mt-4 animate-pulse">
                Booting Registration Gateway...
              </p>
            </div>
          }>
            <RegistrationOnboarding
              onLogTriggered={triggerLog}
              userSession={userSession}
              showToast={showToast}
              onBackToLanding={() => setViewMode('business')}
            />
          </React.Suspense>
        </div>
      ) : (
        <>
          {/* Top Status & Telemetry Header */}
          <div className="bg-slate-900 border-b border-slate-850 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="font-display font-bold text-sm tracking-tight text-slate-100">RealtyConnect™</span>
                <span className="hidden lg:inline text-[9px] font-mono text-slate-500 uppercase tracking-wider">Product of MultiSarv India</span>
                <span className="text-slate-750 font-mono">/</span>
                <span className="font-mono text-slate-400 tracking-tight font-semibold text-xs">Platform Foundation Hub</span>
              </div>
              
              <div className="hidden md:flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded px-2 py-0.5 font-mono text-[10px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>PORT: 3000</span>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('business')}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all"
              >
                <span>← Open Landing Portal</span>
              </button>
            </div>

            {/* Live System Clocks */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
              {maintenanceModeActive && (
                <span className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold animate-pulse text-[10px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  MAINTENANCE MODE ACTIVE
                </span>
              )}

              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                PRODUCTION BASELINE READY
              </span>

              <button
                id="dev-theme-toggle"
                onClick={() => {
                  setIsLightMode(prev => !prev);
                  triggerLog(
                    'THEME_TOGGLED',
                    'system_preferences',
                    'theme',
                    'SUCCESS',
                    `User toggled theme preference in Developer view.`
                  );
                }}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 px-2.5 py-1 rounded text-slate-300 transition-all cursor-pointer"
                title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {isLightMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Light</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">{currentTime} UTC</span>
              </div>
            </div>
          </div>

          {/* Main Container */}
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-display font-semibold text-xs text-slate-100">Foundation Workspace Ready</p>
                  <p className="text-[11px] text-slate-400">Core modules are available for operations, onboarding, and governance workflows.</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                STATUS: READY
              </span>
            </div>

            {/* Dashboard Bento Hub Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1.5 p-1 bg-slate-900 border border-slate-850 rounded-xl">
              {[
                { id: 'blueprint', label: 'Technical Blueprint', icon: FileCheck },
                { id: 'auth', label: 'IAM Gateway', icon: Lock },
                { id: 'masters', label: 'Lookups Registry', icon: Database },
                { id: 'config', label: 'Global variables', icon: Settings },
                { id: 'file', label: 'Quarantine Uploader', icon: File },
                { id: 'noti', label: 'Async Alerts', icon: Bell },
                { id: 'logs', label: 'Compliance Audits', icon: History }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`btn-workspace-tab-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      triggerLog('SWAP_WORKSPACE_VIEW', 'workspace_hub', tab.id, 'SUCCESS', `Swapped workspace terminal view to: ${tab.label}`);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 px-2.5 py-3 rounded-lg text-center transition-all ${
                      active 
                        ? 'bg-slate-950 text-emerald-400 border border-slate-800 shadow-lg' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="text-[10px] font-mono mt-1 font-bold truncate max-w-full leading-none">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Workspace Canvas */}
            <div className="flex-1 min-h-0 bg-slate-900/20 border border-slate-900 rounded-xl p-0.5" id="workspace-canvas">
              <React.Suspense fallback={
                <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  </div>
                  <p className="text-slate-400 font-mono text-[9px] uppercase tracking-wider mt-4 animate-pulse">
                    Streaming Technical Console...
                  </p>
                </div>
              }>
                {activeTab === 'blueprint' && (
                  <DocViewer onLogTriggered={triggerLog} />
                )}

                {activeTab === 'auth' && (
                  <AuthSimulator 
                    onLogTriggered={triggerLog} 
                    onSessionChanged={setUserSession} 
                    maintenanceMode={maintenanceModeActive}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'masters' && (
                  <MastersManager 
                    onLogTriggered={triggerLog} 
                    userSession={userSession}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'config' && (
                  <ConfigPanel 
                    configs={configs} 
                    onConfigChanged={handleConfigChange} 
                    userSession={userSession}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'file' && (
                  <FileUploader 
                    onLogTriggered={triggerLog} 
                    onNotificationTriggered={(type, content) => triggerNotification(type, userSession?.email || 'SYSTEM_OPERATOR', content)}
                    maxSizeMb={maxUploadSizeMb}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'noti' && (
                  <NotificationSimulator 
                    notifications={notifications} 
                    onTriggerNotification={triggerNotification} 
                    onLogTriggered={triggerLog}
                  />
                )}

                {activeTab === 'logs' && (
                  <LogsViewer 
                    logs={logs} 
                    onClearSimulatorLogs={() => {
                      showToast('Immutability policy breach blocked. Compliance logs are read-only under LOG-01.', 'error');
                      triggerLog('SECURITY_CLEAR_LOGS_REJECTED', 'audit_logs', 'all', 'FAILURE', 'Immutability policy enforcement: Blocked user attempt to clear logs.');
                    }}
                  />
                )}
              </React.Suspense>
            </div>
          </div>
        </>
      )}

      {/* Floating Stateful Toast Notification Banner */}
      {toast && (
        <div 
          id="toast-notification-banner"
          className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl border shadow-2xl max-w-md flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success' 
              ? 'bg-slate-900 border-emerald-500/40 text-slate-100' 
              : toast.type === 'error' 
              ? 'bg-slate-900 border-red-500/40 text-slate-100' 
              : 'bg-slate-900 border-slate-700/60 text-slate-100'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              ) : (
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {toast.type === 'success' ? 'SUCCESS TRACE' : toast.type === 'error' ? 'RESTRICTION ALERT' : 'SYSTEM INFO'}
              </h5>
              <p className="text-slate-200 text-xs mt-1 font-sans leading-relaxed pr-6">{toast.message}</p>
            </div>
            
            {/* Interactive Manual Dismiss Button */}
            <button
              onClick={() => setToast(null)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/40 transition-all cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toast Duration Visual Progress Bar */}
          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full rounded-full animate-progress-shrink ${
                toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
              }`}
              style={{
                animation: 'shrinkWidth 4.5s linear forwards',
                width: '100%'
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
