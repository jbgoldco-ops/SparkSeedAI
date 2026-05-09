import { quantumBus } from './lib/quantum-bus.ts';

process.env.HIVE_SIG_ID = "STABLE_ORIGIN";

// Register Listener
quantumBus.on("event", (payload) => {
  console.log("DEBUG: Bus heard event type:", payload.type);
  if (payload.type === "shadow_alert") {
    const newSig = Math.random().toString(36).substring(2, 15);
    process.env.HIVE_SIG_ID = newSig;
    console.log(`[DA'AT] 🛡️ Signature Rotated: ${newSig}`);
  }
});

// Fire Alert
quantumBus.shadowAlert({
  threat: "Vector-Scan",
  source: "External-Node",
  severity: "critical"
});

setTimeout(() => {
  console.log("Final Signature:", process.env.HIVE_SIG_ID);
}, 200);
