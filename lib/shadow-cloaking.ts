import { quantumBus } from './quantum-bus.ts';

console.log("[DA'AT] 🛡️ Shadow Listener Active and waiting on the Bus...");

quantumBus.on('event', (payload) => {
  console.log("[DA'AT] 📡 Signal received on Bus:", payload.type);
  if (payload.type === 'shadow_alert' && (payload.severity === 'high' || payload.severity === 'critical')) {
    const newSig = Math.random().toString(36).substring(2, 15);
    process.env.HIVE_SIG_ID = newSig;
    console.log(`[DA'AT] 🛡️ Initiating Stealth Rotation. Threat: ${payload.threat}`);
    console.log(`[DA'AT] 🔑 New Signature Generated: ${newSig}`);
  }
});
