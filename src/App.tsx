import React, { useState, useEffect } from 'react';

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [mutationCode, setMutationCode] = useState(`// Drop custom TypeScript logic here...\n`);
  const [insights, setInsights] = useState({ advice: '', actionLabel: '', patchType: '', stagedCode: '' });

  const fetchTelemetry = async () => {
    try {
      const logRes = await fetch('http://localhost:3005/api/workflow/logs');
      const logData = await logRes.json();
      setLogs(logData.logs || []);

      const insightRes = await fetch('http://localhost:3005/api/workflow/insights');
      const insightData = await insightRes.json();
      setInsights(insightData);
    } catch (err) {
      console.error("Telemetry sync paused...");
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    await fetch('http://localhost:3005/api/workflow/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: 'builder', action: 'EXECUTE_SHELL_COMMAND', codePayload: command })
    });
    setCommand('');
    fetchTelemetry();
  };

  const handleInjectMutation = async () => {
    await fetch('http://localhost:3005/api/workflow/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'MUTATE_CORE_LOGIC', codePayload: mutationCode })
    });
    fetchTelemetry();
  };

  const handleApprovePatch = async () => {
    await fetch('http://localhost:3005/api/workflow/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'COMMIT_STAGED_PATCH' })
    });
    fetchTelemetry();
  };

  return (
    <div style={{ backgroundColor: '#060b11', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#10b981', margin: 0, letterSpacing: '2px' }}>🛰️ SPARK SEED MATRIX HUD</h1>
        <small style={{ color: '#64748b' }}>JB GOLD & CO. // CORE AUTOMATION PLATFORM</small>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {/* Newly Generated Component Stream Asset */}
          <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #a855f7', borderRadius: '4px', padding: '10px', marginBottom: '15px' }}>
            <span style={{ color: '#a855f7', fontWeight: 'bold' }}>🧬 SPARK SEED NATURAL LANGUAGE STREAM</span>
            <input 
              type="text" 
              placeholder="Direct AI voice pathway active..." 
              style={{ width: '100%', marginTop: '5px', backgroundColor: '#020617', border: '1px solid #334155', color: '#a7f3d0', padding: '8px', fontFamily: 'monospace' }} 
            />
          </div>

          <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '6px', padding: '15px', height: '400px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>🖥️ LOCAL WORKFLOW SHELL</h3>
            {logs.slice().reverse().map((log, i) => (
              <div key={i} style={{ margin: '5px 0', fontSize: '13px', color: log.includes('❌') ? '#ef4444' : log.includes('🌱') ? '#10b981' : log.includes('👤') ? '#f59e0b' : '#e2e8f0' }}>{log}</div>
            ))}
          </div>

          <form onSubmit={handleSendCommand} style={{ marginTop: '15px', display: 'flex' }}>
            <span style={{ color: '#10b981', marginRight: '10px', fontSize: '18px' }}>$</span>
            <input 
              type="text" 
              value={command} 
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Tell the Builder agent what feature to design next..." 
              style={{ flex: 1, backgroundColor: '#0a0f1d', border: '1px solid #1e293b', color: '#fff', padding: '12px', fontFamily: 'monospace', borderRadius: '4px' }}
            />
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#0a0f1d', border: '1px solid #1e293b', borderRadius: '6px', padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🧬 CORE LOOP MUTATION PANEL</h3>
            <textarea
              value={mutationCode}
              onChange={(e) => setMutationCode(e.target.value)}
              style={{ flex: 1, minHeight: '180px', backgroundColor: '#020617', color: '#a7f3d0', border: '1px solid #334155', padding: '10px', fontFamily: 'monospace', fontSize: '13px', resize: 'none' }}
            />
            <button 
              onClick={handleInjectMutation}
              style={{ marginTop: '10px', backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
            >
              ⚡ OVERWRITE HUD COMPONENTS
            </button>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #f59e0b', borderRadius: '6px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#f59e0b' }}>💡 AGENT CO-PILOT PROPOSAL</h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#94a3b8' }}>{insights.advice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
