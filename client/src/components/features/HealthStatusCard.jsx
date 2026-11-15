import React, { useState } from 'react';
import {
  Activity,
  Database,
  Server,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useHealthCheck } from '../../hooks/useHealthCheck';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const HealthStatusCard = () => {
  const { data, loading, error, lastChecked, refetch } = useHealthCheck(true);
  const [showRaw, setShowRaw] = useState(false);

  const isServerOnline = !error && data?.success;
  const healthData = data?.data;
  const isDbConnected = healthData?.database?.connected;

  return (
    <div id="health-status" className="scroll-mt-24">
      <Card className="border-gold-300/40 overflow-hidden shadow-card">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur rounded-xl text-gold-400 border border-white/10">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                  System Health & Foundation Diagnostics
                </h3>
                {loading ? (
                  <Badge variant="warning" dot size="sm">
                    Checking...
                  </Badge>
                ) : isServerOnline ? (
                  <Badge variant="success" dot size="sm">
                    API Online
                  </Badge>
                ) : (
                  <Badge variant="danger" dot size="sm">
                    API Unreachable
                  </Badge>
                )}
              </div>
              <p className="text-xs text-navy-300 mt-1">
                Monitors backend server, environment variables, and MongoDB connectivity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              isLoading={loading}
              leftIcon={RefreshCw}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              Ping Server
            </Button>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Status Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Backend Service Status */}
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Backend API
                </span>
                <Server className="w-4 h-4 text-navy-400" />
              </div>
              <div className="flex items-center gap-2">
                {isServerOnline ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-navy-900">
                    {isServerOnline ? 'Operating Normally' : 'Offline / Error'}
                  </div>
                  <div className="text-xs text-navy-500">
                    {data?.latencyMs !== undefined ? `${data.latencyMs} ms latency` : 'No response'}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MongoDB Database Status */}
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  MongoDB Status
                </span>
                <Database className="w-4 h-4 text-navy-400" />
              </div>
              <div className="flex items-center gap-2">
                {isDbConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-semibold text-navy-900 capitalize">
                    {healthData?.database?.status || 'Disconnected'}
                  </div>
                  <div className="text-xs text-navy-500 truncate max-w-[140px]">
                    {healthData?.database?.name
                      ? `db: ${healthData.database.name}`
                      : 'mongodb://localhost:27017'}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Environment & Node */}
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Runtime Environment
                </span>
                <Cpu className="w-4 h-4 text-navy-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-navy-900 capitalize">
                    {healthData?.environment || 'Development'}
                  </div>
                  <div className="text-xs text-navy-500">
                    Node {healthData?.system?.nodeVersion || process.version || 'v22.x'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Server Uptime */}
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Uptime & Sync
                </span>
                <Clock className="w-4 h-4 text-navy-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-navy-900">
                    {healthData?.uptimeSeconds !== undefined
                      ? `${healthData.uptimeSeconds}s active`
                      : 'Pending'}
                  </div>
                  <div className="text-xs text-navy-500">
                    {lastChecked ? lastChecked.toLocaleTimeString() : 'Not checked'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offline/Error notice if server cannot be reached */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Cannot connect to Express backend server</p>
                <p className="text-xs text-rose-700">
                  Ensure the backend is running using <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">npm run dev:server</code> on port 5000.
                </p>
              </div>
            </div>
          )}

          {/* Toggle Raw JSON Response View */}
          <div className="pt-2 border-t border-sand-200">
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="flex items-center gap-2 text-xs font-semibold text-navy-600 hover:text-navy-900 transition-colors"
            >
              {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showRaw ? 'Hide JSON Diagnostic Payload' : 'View Raw Health-Check Payload'}</span>
            </button>

            {showRaw && (
              <pre className="mt-3 p-4 rounded-xl bg-navy-950 text-gold-300 font-mono text-xs overflow-x-auto max-h-64">
                {JSON.stringify(data || error, null, 2)}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

