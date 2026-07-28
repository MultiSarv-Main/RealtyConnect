/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Database, 
  GitBranch, 
  ArrowRight, 
  Terminal, 
  CheckSquare, 
  Play, 
  Server, 
  Check, 
  Circle,
  Clock,
  PlayCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { 
  BUSINESS_REQUIREMENT, 
  BUSINESS_RULES, 
  DATABASE_DESIGN, 
  UI_FLOW, 
  API_LIST, 
  DEVELOPMENT_TASKS as INITIAL_TASKS, 
  TEST_CASES as INITIAL_TESTS, 
  DEPLOYMENT_NOTES 
} from '../data/blueprint';
import { DevTask, TestCase } from '../types';

interface DocViewerProps {
  onLogTriggered: (action: string, entity: string, entityId: string, status: 'SUCCESS' | 'FAILURE' | 'WARNING', details: string) => void;
}

export default function DocViewer({ onLogTriggered }: DocViewerProps) {
  const [activeTab, setActiveTab] = useState<'req' | 'rules' | 'db' | 'er' | 'uiflow' | 'api' | 'tasks' | 'tests' | 'deploy'>('req');
  const [tasks, setTasks] = useState<DevTask[]>(INITIAL_TASKS);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TESTS);
  const [highlightedTable, setHighlightedTable] = useState<string | null>(null);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus: DevTask['status'] = 
          t.status === 'Todo' ? 'In Progress' : 
          t.status === 'In Progress' ? 'Completed' : 'Todo';
        
        onLogTriggered(
          'DEV_TASK_STATUS_CHANGED',
          'dev_tasks',
          id,
          'SUCCESS',
          `Task status updated to ${nextStatus}: "${t.title}"`
        );
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const executeTestCase = (id: string) => {
    setRunningTestId(id);
    onLogTriggered(
      'TEST_CASE_EXECUTION_STARTED',
      'test_cases',
      id,
      'WARNING',
      `Initializing test suite runner for ${id}`
    );

    setTimeout(() => {
      setTestCases(prev => prev.map(tc => {
        if (tc.id === id) {
          const nextStatus: TestCase['status'] = 'Passed';
          onLogTriggered(
            'TEST_CASE_EXECUTION_COMPLETED',
            'test_cases',
            id,
            'SUCCESS',
            `Test "${tc.title}" passed expected outcomes: ${tc.expected}`
          );
          return { ...tc, status: nextStatus };
        }
        return tc;
      }));
      setRunningTestId(null);
    }, 1200);
  };

  // Helper to render simple markdown-like elements nicely
  const renderSimpleMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-display font-semibold text-lg text-slate-100 mt-6 mb-2 tracking-tight flex items-center gap-2 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-display font-medium text-md text-emerald-400 mt-4 mb-2">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- **')) {
        const parts = line.replace('- **', '').split('**:');
        return (
          <p key={idx} className="text-slate-300 text-sm ml-4 mb-2 leading-relaxed">
            <strong className="text-slate-100 font-medium">{parts[0]}:</strong>
            {parts[1] || ''}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="text-slate-300 text-sm ml-6 list-disc mb-1 leading-relaxed">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('|')) {
        // Table row
        if (line.includes('---')) return null; // Skip separator line
        const cols = line.split('|').map(c => c.trim()).filter(c => c !== '');
        const isHeader = idx === 1 || line.includes('Column Name');
        return (
          <div key={idx} className={`grid grid-cols-4 gap-2 py-2 px-3 text-xs font-mono border-b border-slate-900 ${isHeader ? 'bg-slate-900/50 text-slate-100 font-bold' : 'text-slate-300'}`}>
            {cols.map((col, cIdx) => (
              <span key={cIdx} className="truncate" title={col.replace(/`/g, '')}>{col.replace(/`/g, '')}</span>
            ))}
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-slate-300 text-sm mb-3 leading-relaxed">{line}</p>;
    });
  };

  const tableRelationships = [
    { from: 'user_roles', to: 'users', label: 'user_id ➔ id', color: 'border-blue-500 text-blue-400' },
    { from: 'user_roles', to: 'roles', label: 'role_code ➔ code', color: 'border-emerald-500 text-emerald-400' },
    { from: 'role_permissions', to: 'roles', label: 'role_code ➔ code', color: 'border-yellow-500 text-yellow-400' },
    { from: 'role_permissions', to: 'permissions', label: 'permission_code ➔ code', color: 'border-purple-500 text-purple-400' },
    { from: 'uploaded_files', to: 'users', label: 'uploader_id ➔ id', color: 'border-indigo-500 text-indigo-400' },
    { from: 'audit_logs', to: 'users', label: 'user_id ➔ id', color: 'border-rose-500 text-rose-400' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl" id="platform-blueprint">
      {/* Blueprint Header */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md">
              Phase 01 Artifact
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Status: LOCKED (APPROVED)</span>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-100 mt-1 tracking-tight">
            Platform Foundation Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive business parameters, technical data models, flow specifications, and verification matrices.
          </p>
        </div>

        {/* Tab navigation in 2 rows for responsive spacing */}
        <div className="flex flex-wrap gap-1 p-0.5 bg-slate-950 border border-slate-800/80 rounded-lg">
          {[
            { id: 'req', label: 'Requirements', icon: BookOpen },
            { id: 'rules', label: 'Business Rules', icon: ShieldCheck },
            { id: 'db', label: 'Schema Specifications', icon: Database },
            { id: 'er', label: 'ER Diagram Map', icon: GitBranch },
            { id: 'uiflow', label: 'UI Flow Plans', icon: ArrowRight },
            { id: 'api', label: 'Core APIs', icon: Terminal },
            { id: 'tasks', label: 'Dev Tasks', icon: CheckSquare },
            { id: 'tests', label: 'Test Matrices', icon: PlayCircle },
            { id: 'deploy', label: 'Deployment Specs', icon: Server },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  onLogTriggered('VIEW_BLUEPRINT_SECTION', 'blueprint_viewer', tab.id, 'SUCCESS', `Inspecting blueprint section: ${tab.label}`);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  active 
                    ? 'bg-slate-850 text-emerald-400 border border-slate-700/85 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blueprint Content Screen */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-950/40 text-slate-200">
        {activeTab === 'req' && (
          <div className="space-y-4 max-w-4xl" id="content-requirements">
            {renderSimpleMarkdown(BUSINESS_REQUIREMENT)}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4 max-w-4xl" id="content-rules">
            {renderSimpleMarkdown(BUSINESS_RULES)}
          </div>
        )}

        {activeTab === 'db' && (
          <div className="space-y-6 max-w-4xl" id="content-db">
            <div className="p-3 bg-slate-900/30 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                These tables define the fundamental structure of the Platform Foundation. They are implemented in PostgreSQL and mapped using an ORM to secure full isolation between roles and maintain immutable audit chains.
              </span>
            </div>
            {renderSimpleMarkdown(DATABASE_DESIGN)}
          </div>
        )}

        {activeTab === 'er' && (
          <div className="space-y-6 h-full flex flex-col" id="content-er">
            <div className="p-3 bg-slate-900/30 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-start gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-200">Interactive Entity Relationship Schema</p>
                <p className="mt-0.5">Hover or tap on a database entity box below to highlight and trace its relational integrity links, foreign keys, and cascading structures.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Table list */}
              {[
                { 
                  name: 'users', 
                  desc: 'Core IAM Identities',
                  fields: ['id (UUID, PK)', 'email (VARCHAR)', 'password_hash (VARCHAR)', 'status (VARCHAR)', 'failed_attempts (INT)', 'lockout_until (TIMESTAMP)'] 
                },
                { 
                  name: 'roles', 
                  desc: 'Stakeholder Boundaries',
                  fields: ['code (VARCHAR, PK)', 'name (VARCHAR)', 'description (TEXT)', 'is_system (BOOLEAN)'] 
                },
                { 
                  name: 'permissions', 
                  desc: 'Atomic Action Codes',
                  fields: ['code (VARCHAR, PK)', 'name (VARCHAR)', 'module (VARCHAR)'] 
                },
                { 
                  name: 'user_roles', 
                  desc: 'Many-to-Many IAM Junction',
                  fields: ['user_id (UUID, FK ➔ users.id)', 'role_code (VARCHAR, FK ➔ roles.code)'] 
                },
                { 
                  name: 'role_permissions', 
                  desc: 'Role Scope Mapping',
                  fields: ['role_code (VARCHAR, FK ➔ roles.code)', 'permission_code (VARCHAR, FK ➔ permissions.code)'] 
                },
                { 
                  name: 'uploaded_files', 
                  desc: 'Document Quarantine Registry',
                  fields: ['id (UUID, PK)', 'name (VARCHAR)', 'size_bytes (BIGINT)', 'mime_type (VARCHAR)', 'status (VARCHAR)', 'uploader_id (UUID, FK ➔ users.id)'] 
                },
                { 
                  name: 'audit_logs', 
                  desc: 'Tamper-Evident Chain Logs',
                  fields: ['id (BIGINT, PK)', 'timestamp (TIMESTAMP)', 'user_id (UUID, FK ➔ users.id)', 'action (VARCHAR)', 'details (TEXT)', 'chain_hash (VARCHAR)'] 
                }
              ].map(table => {
                const isTargetOfHover = highlightedTable && tableRelationships.some(
                  r => r.from === highlightedTable && r.to === table.name
                );
                const isSourceOfHover = highlightedTable === table.name;
                const isRelated = isTargetOfHover || isSourceOfHover;

                return (
                  <div 
                    key={table.name}
                    id={`er-table-${table.name}`}
                    onMouseEnter={() => setHighlightedTable(table.name)}
                    onMouseLeave={() => setHighlightedTable(null)}
                    className={`p-3.5 rounded-lg border transition-all duration-300 ${
                      isSourceOfHover 
                        ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/30' 
                        : isTargetOfHover 
                        ? 'bg-slate-900/50 border-emerald-600 shadow-sm'
                        : highlightedTable 
                        ? 'bg-slate-950/20 border-slate-900 opacity-40' 
                        : 'bg-slate-900/20 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-800/80">
                      <span className="font-mono text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSourceOfHover ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        {table.name}
                      </span>
                      <span className="text-[10px] text-slate-400 italic">{table.desc}</span>
                    </div>
                    <div className="space-y-1 font-mono text-[10px] text-slate-300">
                      {table.fields.map((f, fIdx) => (
                        <div key={fIdx} className="hover:text-white transition-colors py-0.5">
                          {f.includes('PK') && <span className="text-yellow-400 mr-1">🔑</span>}
                          {f.includes('FK') && <span className="text-emerald-400 mr-1">🔗</span>}
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Relationship tracer text */}
            <div className="mt-4 p-4 bg-slate-900/40 border border-slate-800 rounded-lg flex-1">
              <h4 className="font-display font-medium text-xs text-slate-300 mb-2.5 uppercase tracking-wider">Active Relational Constraints (Trace Engine)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {tableRelationships.map((rel, index) => {
                  const isActive = !highlightedTable || highlightedTable === rel.from || highlightedTable === rel.to;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-2 rounded border border-slate-850/80 text-xs font-mono transition-all duration-350 ${
                        isActive ? 'bg-slate-900/70 opacity-100 text-slate-200' : 'opacity-20 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{rel.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="font-bold text-slate-100">{rel.to}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 italic bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{rel.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uiflow' && (
          <div className="space-y-4 max-w-4xl" id="content-uiflow">
            {renderSimpleMarkdown(UI_FLOW)}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4 max-w-4xl" id="content-api">
            {renderSimpleMarkdown(API_LIST)}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4" id="content-tasks">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" />
                Sprint Implementation Plan
              </h3>
              <span className="text-xs text-slate-400 font-mono">Click checkbox to cycle progress status</span>
            </div>
            
            <div className="space-y-2.5">
              {tasks.map(task => {
                const isCompleted = task.status === 'Completed';
                const isInProgress = task.status === 'In Progress';
                return (
                  <div 
                    key={task.id}
                    id={`task-item-${task.id}`}
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`p-3.5 rounded-lg border flex items-start gap-3.5 cursor-pointer transition-all duration-200 select-none ${
                      isCompleted 
                        ? 'bg-slate-900/20 border-slate-800/60 opacity-60 hover:opacity-80' 
                        : isInProgress 
                        ? 'bg-slate-900/50 border-emerald-500/50 shadow-sm hover:border-emerald-500' 
                        : 'bg-slate-900/10 border-slate-850 hover:border-slate-800 hover:bg-slate-900/20'
                    }`}
                  >
                    <button className="flex-shrink-0 mt-0.5 focus:outline-none">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : isInProgress ? (
                        <div className="w-5 h-5 rounded-md border border-emerald-500/60 flex items-center justify-center text-emerald-500 animate-pulse">
                          <Circle className="w-3.5 h-3.5 fill-emerald-500/30" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border border-slate-700 flex items-center justify-center" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{task.id}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded ${
                          isCompleted ? 'bg-slate-800 text-slate-400' : isInProgress ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800/80 text-slate-400'
                        }`}>
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono ml-auto">Est: {task.estimate}</span>
                      </div>
                      <p className={`text-sm mt-1 font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">Assigned Owner: <span className="text-slate-300">{task.owner}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-4" id="content-tests">
            <div className="pb-2 border-b border-slate-800">
              <h3 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-emerald-400" />
                Integration Testing & Validation Registry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Trigger and simulate exact testing behaviors directly in your preview sandbox.</p>
            </div>

            <div className="space-y-3.5">
              {testCases.map(tc => {
                const isPassed = tc.status === 'Passed';
                const isRunning = runningTestId === tc.id;
                return (
                  <div 
                    key={tc.id}
                    id={`test-case-${tc.id}`}
                    className={`p-4 rounded-lg border bg-slate-900/10 border-slate-850 flex flex-col gap-2.5 transition-all duration-200 ${
                      isRunning ? 'border-yellow-500/50 bg-slate-900/30' : isPassed ? 'border-emerald-500/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500">{tc.id}</span>
                        <h4 className="text-sm font-semibold text-slate-200">{tc.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                          isPassed 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : isRunning 
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse' 
                            : 'bg-slate-850 text-slate-400 border border-slate-800'
                        }`}>
                          {isRunning ? 'RUNNING' : tc.status}
                        </span>
                        
                        <button
                          onClick={() => executeTestCase(tc.id)}
                          disabled={isRunning}
                          id={`btn-run-test-${tc.id}`}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded shadow-sm transition-all ${
                            isRunning 
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:shadow'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          <span>{isRunning ? 'RUNNING' : 'RUN'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/65 p-3 rounded border border-slate-850">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-0.5">Preconditions</span>
                        <span className="text-slate-300 font-sans">{tc.precondition}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-0.5">Expected Outcome</span>
                        <span className="text-slate-300 font-sans">{tc.expected}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-1">Execution Action Steps</span>
                      <ol className="list-decimal pl-4.5 text-xs text-slate-300 space-y-0.5">
                        {tc.steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-4 max-w-4xl" id="content-deploy">
            {renderSimpleMarkdown(DEPLOYMENT_NOTES)}
          </div>
        )}
      </div>
    </div>
  );
}
