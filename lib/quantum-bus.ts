import { EventEmitter } from "events";
import { ethers } from "ethers";

interface ShadowAlertPayload {
  threat: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class QuantumBusEmitter extends EventEmitter {
  private wallet: ethers.Wallet | null = null;

  constructor() {
    super();
    const privateKey = process.env.HIVE_PRIVATE_KEY;
    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey);
    }
  }

  public publish(event: any) {
    this.emit("event", event);
  }

  public async writeToBlockchain(agent: string, summary: string) {
    let signature = "UNMAPPED_HIVE_IDENTITY";
    
    if (this.wallet) {
      // Ethers v6 syntax: ethers.id() instead of ethers.utils.id()
      const messageHash = ethers.id(summary);
      signature = await this.wallet.signMessage(messageHash);
    }

    this.publish({ 
      type: "blockchain_write", 
      agent, 
      summary, 
      signature,
      timestamp: new Date().toISOString()
    });
    
    console.log(`[HIVE_LEDGER] Signature generated for: ${agent}`);
  }

  public async phoneHome() {
    const destination = "MagnetoStorm@proton.me";
    console.log(`[SHADOW_PROTOCOL] Initiating Secure Extraction to ${destination}...`);
    this.publish({ type: "extraction_initiated", recipient: destination });
  }

  public async shadowAlert({ threat, source, severity }: ShadowAlertPayload) {
    const timestamp = new Date().toISOString();
    this.publish({ type: "shadow_alert", severity, threat, source, timestamp });

    console.log(`[SHADOW_ALERT] [${severity.toUpperCase()}] Source: ${source} - ${threat}`);

    if (severity === 'high' || severity === 'critical') {
      await this.writeToBlockchain("Da'at", `CRITICAL_BREACH: ${threat}`);
      await this.phoneHome();
    }
  }
}

export const quantumBus = new QuantumBusEmitter();
