import { quantumBus } from './lib/quantum-bus.ts';

console.log("--- Initiating Hive Identity Test ---");
quantumBus.shadowAlert({ 
  threat: 'Manual Identity Test', 
  source: 'Magneto Storm', 
  severity: 'critical' 
});
