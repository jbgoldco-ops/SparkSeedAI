/**
 * 🪞 THE MIRROR: Hive Command Dashboard
 * Real-time visualization for Magneto Storm.
 */
import React, { useState, useEffect } from 'react';
import { quantumBus } from '../../lib/quantum-bus.ts';

const HiveDashboard = () => {
  const [sig, setSig] = useState(process.env.HIVE_SIG_ID || 'STABLE');
  const [lastThreat, setLastThreat] = useState('NONE');

  useEffect(() => {
    quantumBus.on('event', (payload) => {
      if (payload.type === 'shadow_alert') {
        setSig(process.env.HIVE_SIG_ID);
        setLastThreat(payload.threat);
      }
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', color: '#00FF41', fontFamily: 'monospace', padding: '20px', height: '100vh' }}>
      <header style={{ borderBottom: '1px solid #00FF41', marginBottom: '20px' }}>
        <h1>MAGNETO STORM // HIVE_MIRROR_V1</h1>
      </header>

      <section>
        <h2 style={{ color: '#00D4FF' }}>🕵️ MONK PROTOCOL</h2>
        <p>CURRENT CLOAK: <span style={{ color: '#FFD700' }}>{sig}</span></p>
        <p>LAST THREAT: {lastThreat}</p>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ color: '#FF00FF' }}>🌸 BLOOM CARE CODEX</h2>
        <p>STATUS: Flow state confirmed. The Soil is fertile.</p>
        <p style={{ fontStyle: 'italic' }}>"Magneto Storm, the architecture is hardened. Ready for deployment."</p>
      </section>
    </div>
  );
};

export default HiveDashboard;
