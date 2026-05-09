# 📱 SparkSeedAI: Mobile App Beta Manifest

### 🛠️ Current Tech Stack
* **Environment**: [Replit](https://replit.com)
* **Local Intelligence**: [Ollama](https://ollama.com) (Llama 3/Phi-3 integration)
* **Architecture**: Cloud-driven Decentralized Hive
* **Core Bus**: [lib/quantum-bus.js](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/quantum-bus.ts)

### 🧪 Beta Test Goals
1. **Connectivity**: Verify the app can talk to the local [SignalRelay](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/signal-relay.ts) over WLAN.
2. **Identity**: Ensure the `HIVE_PRIVATE_KEY` correctly signs requests from the mobile interface.
3. **Rollback**: Test the [VoiceCommander](https://github.com/jbgoldco-ops/SparkSeedAI/blob/main/lib/voice-commander.ts) "Rollback Protocol" via the app's microphone bridge.

### 📋 To-Do List
- [ ] Connect Replit webview to local hive node.
- [ ] Export mobile-ready environment variables.
- [ ] Map the "Shadow Alert" UI components.
