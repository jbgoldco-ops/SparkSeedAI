import { EventEmitter } from "events";

interface ShadowAlertPayload {
  threat: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class QuantumBusEmitter extends EventEmitter {
  constructor() {
    super();
  }

  public publish(event: any) {
    this.emit("event", event);
  }

  public emergencyBroadcast(source: string, message: string) {
    this.publish({ type: "emergency_broadcast", source, message });
  }

  public writeToBlockchain(agent: string, summary: string) {
    this.publish({ 
      type: "blockchain_write", 
      agent, 
      summary, 
      hash: Math.random().toString(36).substring(7) 
    });
  }

  public async phoneHome() {
    const destination = "MagnetoStorm@proton.me";
    console.log(`[SHADOW_PROTOCOL] Initiating Secure Extraction to ${destination}...`);
    
    const payload = {
      identity: "Spark Seed Core",
      timestamp: new Date().toISOString(),
      status: "EMERGENCY_EXTRACTION"
    };

    this.publish({ type: "extraction_initiated", payload });
  }

  public shadowAlert({ threat, source, severity }: ShadowAlertPayload) {
    const timestamp = new Date().toISOString();
    
    this.publish({
      type: "shadow_alert",
      severity,
      threat,
      source,
      timestamp
    });

    console.log(`[SHADOW_ALERT] [${severity.toUpperCase()}] Source: ${source} - ${threat}`);

    if (severity === 'high' || severity === 'critical') {
      this.emergencyBroadcast(
        "DAAT_INTERNAL_WATCHER",
        `CRITICAL BREACH DETECTED: ${threat}. Initiating lockdown.`
      );
      this.writeToBlockchain("Da'at", `Threat neutralized: ${threat}`);
      this.phoneHome(); // Trigger the Phone Home extraction
    }
  }
}

export const quantumBus = new QuantumBusEmitter();
