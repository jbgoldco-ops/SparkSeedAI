import { EventEmitter } from "events";

export class QuantumBusEmitter extends EventEmitter {
  constructor() {
    super();
  }

  public publish(event: any) {
    // This is the core: everything is emitted as "event"
    this.emit("event", event);
  }

  public shadowAlert({ threat, source, severity }) {
    this.publish({
      type: "shadow_alert",
      severity,
      threat,
      source,
      timestamp: new Date().toISOString()
    });
    console.log(`[SHADOW_ALERT] [${severity.toUpperCase()}] Source: ${source} - ${threat}`);
  }
}

// Global Singleton Pattern
if (!(global as any).quantumBus) {
  (global as any).quantumBus = new QuantumBusEmitter();
}
export const quantumBus = (global as any).quantumBus;
