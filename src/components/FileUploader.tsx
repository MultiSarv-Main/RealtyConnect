/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Info 
} from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploaderProps {
  onLogTriggered: (action: string, entity: string, entityId: string, status: 'SUCCESS' | 'FAILURE' | 'WARNING', details: string) => void;
  onNotificationTriggered: (type: 'email' | 'sms' | 'push' | 'in_app', content: string) => void;
  maxSizeMb: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function FileUploader({ onLogTriggered, onNotificationTriggered, maxSizeMb, showToast }: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 'f1', name: 'architect_layout_rev3.pdf', size: 4500000, type: 'application/pdf', status: 'success', url: '#', uploadedAt: '2026-07-16 07:12', md5: '3c1e309cbdf71d3462987a409852be27' },
    { id: 'f2', name: 'site_survey_north.png', size: 1800000, type: 'image/png', status: 'success', url: '#', uploadedAt: '2026-07-16 07:15', md5: '9a318dfb71b3422987a409852ce2b005' }
  ]);
  const [dragActive, setDragActive] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    // 1. Validation - File Extension
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!allowedExtensions.includes(extension)) {
      onLogTriggered(
        'SECURITY_FILE_REJECTED_UNSUPPORTED_TYPE',
        'uploaded_files',
        file.name,
        'FAILURE',
        `File upload aborted: Extension ".${extension}" is unsupported. Whitelist limits to: PDF, PNG, JPG.`
      );
      showToast(`Upload Blocked: Unsupported file type. Only PDF, PNG, JPG, and JPEG documents are permitted under Rule FILE-01.`, 'error');
      return;
    }

    // 2. Validation - File Size
    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onLogTriggered(
        'SECURITY_FILE_REJECTED_SIZE_LIMIT',
        'uploaded_files',
        file.name,
        'FAILURE',
        `File upload aborted: File size of ${formatBytes(file.size)} exceeds configured maximum threshold limit of ${maxSizeMb}MB.`
      );
      showToast(`Upload Blocked: File size exceeds the active platform limit of ${maxSizeMb}MB.`, 'error');
      return;
    }

    // 3. Initiate Upload & Sandbox scanning
    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || 'unknown/binary',
      status: 'scanning',
      url: '#',
      uploadedAt: new Date().toISOString().replace('T', ' ').substr(0, 16),
      md5: Math.random().toString(16).substr(2, 32)
    };

    setFiles(prev => [newFile, ...prev]);
    onLogTriggered(
      'FILE_UPLOAD_INITIATED',
      'uploaded_files',
      fileId,
      'WARNING',
      `Registry entry created in SCANNING quarantine block for "${file.name}" [ID: ${fileId}]. Initiating malware scan hooks.`
    );
    onNotificationTriggered('in_app', `File "${file.name}" uploaded. Initiating sandbox security scan...`);

    // Simulate malware/antivirus analysis
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          onLogTriggered(
            'FILE_SCAN_CLEAN_APPROVED',
            'uploaded_files',
            fileId,
            'SUCCESS',
            `Quarantine scan passed. SHA-256 integrity verified for file "${f.name}". Download unlocked.`
          );
          onNotificationTriggered('in_app', `Malware scan complete. "${f.name}" has been approved and saved securely.`);
          return { ...f, status: 'success' };
        }
        return f;
      }));
    }, 2500);
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerMaliciousUploadSim = () => {
    // Instantly simulate a payload threat
    const fileId = Math.random().toString(36).substr(2, 9);
    const mockMalicious: UploadedFile = {
      id: fileId,
      name: 'critical_exploit_payload.exe',
      size: 1450000,
      type: 'application/x-msdownload',
      status: 'scanning',
      url: '#',
      uploadedAt: new Date().toISOString().replace('T', ' ').substr(0, 16),
      md5: '7ca31e309cbdf71d3462987a409852be2d'
    };

    setFiles(prev => [mockMalicious, ...prev]);
    onLogTriggered(
      'SECURITY_MALICIOUS_FILE_QUARANTINED',
      'uploaded_files',
      fileId,
      'WARNING',
      `CRITICAL ALERT: File "critical_exploit_payload.exe" uploaded. Registry status set to SCANNING quarantine block.`
    );
    onNotificationTriggered('push', `CRITICAL: Quarantine scanner identified a structural threat in "critical_exploit_payload.exe"!`);

    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          onLogTriggered(
            'SECURITY_AV_SCAN_FAILED_ALERT',
            'uploaded_files',
            fileId,
            'FAILURE',
            `MALWARE THREAT DETECTED: ClamAV identified Win.Trojan.Generic inside "critical_exploit_payload.exe". File quarantine locked and admin notified.`
          );
          onNotificationTriggered('email', `Platform Security alert dispatched to Administrator: Malware quarantined.`);
          return { ...f, status: 'failed' };
        }
        return f;
      }));
    }, 2500);
  };

  const handleDeleteFile = (id: string, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    onLogTriggered(
      'FILE_REGISTRY_RECORD_REMOVED',
      'uploaded_files',
      id,
      'SUCCESS',
      `Audit Trigger: Removed file registry pointer and associated block storage for "${name}" [ID: ${id}].`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="file-uploader-root">
      {/* File Drop zone */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <span className="text-[10px] text-slate-500 font-mono block uppercase px-1 tracking-wider">Secure Document Upload Interface</span>
        
        {/* Drag and Drop Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload file - Drag and drop a file or press Enter to browse"
          id="drag-drop-zone"
          className={`flex-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer select-none min-h-[180px] transition-all focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/5 ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-500/5' 
              : 'border-slate-800 hover:border-slate-750 bg-slate-900/10 hover:bg-slate-900/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <UploadCloud className={`w-10 h-10 mb-3.5 transition-colors ${dragActive ? 'text-emerald-400' : 'text-slate-600'}`} />
          <p className="text-sm font-semibold text-slate-200">Drag & Drop file here, or click to browse</p>
          <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase">
            PDF, PNG, JPG, JPEG only (Max size: {maxSizeMb}MB)
          </p>
        </div>

        {/* Security Drill Test Trigger Box */}
        <div className="p-3.5 bg-slate-900/10 border border-slate-850 rounded-xl">
          <h4 className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            Security Intrusion Testbed
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Simulate a malicious Trojan attempt to check how quarantine sandboxes flag and lock payloads automatically.
          </p>
          <button
            onClick={triggerMaliciousUploadSim}
            id="btn-simulate-malware"
            className="w-full bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500/60 text-red-400 font-mono font-bold py-1.5 px-3 rounded text-xs transition-all flex items-center justify-center gap-1.5"
          >
            Inject Malicious EXE Simulation
          </button>
        </div>
      </div>

      {/* Uploaded File Registry list */}
      <div className="lg:col-span-7 p-5 bg-slate-900/30 border border-slate-800 rounded-xl flex flex-col justify-between" id="file-registry-dashboard">
        <div>
          <h3 className="font-display font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-900">
            <File className="w-4 h-4 text-emerald-400" />
            Active Document & File Registry
          </h3>

          {/* Files container */}
          <div className="space-y-2 mt-4 max-h-[195px] overflow-y-auto pr-1">
            {files.length === 0 ? (
              <div className="py-10 text-center text-slate-550 text-xs font-mono">
                No documents are registered in active memory cache.
              </div>
            ) : (
              files.map(file => {
                const isScanning = file.status === 'scanning';
                const isSuccess = file.status === 'success';
                const isFailed = file.status === 'failed';

                return (
                  <div 
                    key={file.id}
                    id={`file-row-${file.id}`}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3.5 transition-all ${
                      isFailed 
                        ? 'bg-red-950/15 border-red-900/40 text-red-350' 
                        : isScanning 
                        ? 'bg-slate-950/50 border-slate-850' 
                        : 'bg-slate-950 border-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded mt-0.5 ${
                        isFailed ? 'bg-red-500/10 text-red-400' : isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {isFailed ? <ShieldAlert className="w-4 h-4" /> : isSuccess ? <ShieldCheck className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                      </div>
                      
                      <div className="min-w-0">
                        <span className="font-medium text-xs text-slate-200 block truncate" title={file.name}>{file.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono text-slate-500">{formatBytes(file.size)}</span>
                          <span className="text-[9px] text-slate-650">•</span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{file.type}</span>
                          <span className="text-[9px] text-slate-650">•</span>
                          <span className="text-[9px] font-mono text-slate-500 truncate max-w-[100px]" title={`MD5: ${file.md5}`}>MD5:{file.md5.substr(0,8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isScanning && (
                        <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 flex items-center gap-1">
                          SCANNING
                        </span>
                      )}
                      {isSuccess && (
                        <>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            SECURE
                          </span>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            id={`btn-delete-file-${file.id}`}
                            className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-slate-900 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isFailed && (
                        <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1 font-bold">
                          THREAT QUARANTINED
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Warning Policy info box */}
        <div className="mt-5 p-3.5 bg-slate-900/20 border border-slate-850 rounded-lg text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Quarantine Policy (Rule FILE-03) active:</strong> Files are blocked from access/download while scanning. Any flagged virus matches instantly isolate the file byte-blocks and fire platform security breach signals.
          </span>
        </div>
      </div>
    </div>
  );
}
