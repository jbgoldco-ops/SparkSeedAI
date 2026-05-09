# 📱 SparkSeedAI: Mobile App Beta Manifest

### 🛠️ Tech Stack Alignment
* **Platform**: [Replit](https://replit.com) (Mobile Webview / React Native)
* **Intelligence**: [Ollama](https://ollama.com) Local Node Integration
* **Communication**: [SignalRelay](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/signal-relay.ts) (WLAN/Cellular)

### 🧪 Current Test Objectives
1. **Handshake**: Verify the mobile client can ping the local [SignalRelay](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/signal-relay.ts).
2. **Identity**: Confirm the `HIVE_PRIVATE_KEY` correctly signs "Beta Request" events.
3. **Voice Kill-Switch**: Test the [VoiceCommander](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/voice-commander.ts) "Rollback Protocol" from a mobile mic input.

### 📋 Forge To-Do
- [ ] Connect Replit Secrets to local .env configuration.
- [ ] Map Shadow Alert UI components to mobile notifications.
- [ ] Execute first WLAN packet sniff test from the device.
