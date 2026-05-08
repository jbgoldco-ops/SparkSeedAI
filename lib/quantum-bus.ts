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

  /**
   * SHADOW PROTOCOL: Managed by the 9th entity, Da'at.
   */
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
    }
  }
}

export const quantumBus = new QuantumBusEmitter();
