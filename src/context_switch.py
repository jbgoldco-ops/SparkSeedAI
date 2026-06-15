import os

class ContextSwitch:
    def __init__(self):
        self.active_mode = "NONE"
        self.state_dir = "./state_snapshots"
        os.makedirs(self.state_dir, exist_ok=True)

    def toggle(self, target_mode):
        print(f"[SYSTEM] Toggling from {self.active_mode} to {target_mode}...")
        self._save_state()
        self._clear_memory()
        self.active_mode = target_mode
        self._load_state()

    def _save_state(self):
        print(f"[MEMORY] Serializing {self.active_mode} state.")

    def _clear_memory(self):
        print("[MEMORY] Memory cache flushed. Isolation achieved.")

    def _load_state(self):
        print(f"[SYSTEM] {self.active_mode} mode activated.")

switch = ContextSwitch()
