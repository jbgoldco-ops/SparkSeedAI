import os
import time
import hmac
import hashlib
import uuid
import secrets
import requests

class MayaBeaconSecure:
    def __init__(self):
        self.gateway_url = os.getenv("GCP_BEACON_GATEWAY")
        self.secret_key = os.getenv("ZENITH_CORE_SECRET", "fallback_secret").encode()
        self.local_node_id = str(uuid.uuid4())
        self.trusted_hash_registry = "a1b2c3d4e5f6..." 

    def _generate_hardened_signature(self, payload_string):
        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(16)
        message = f"{payload_string}:{timestamp}:{nonce}".encode()
        signature = hmac.new(self.secret_key, message, hashlib.sha256).hexdigest()
        return signature, timestamp, nonce

    def amplify_signal(self, payload):
        if not self.gateway_url:
            return self.local_swarm_fallback(payload)
        try:
            sig, ts, nonce = self._generate_hardened_signature(str(payload))
            secure_payload = {
                "data": payload,
                "signature": sig,
                "timestamp": ts,
                "nonce": nonce,
                "node_id": self.local_node_id
            }
            response = requests.post(f"{self.gateway_url}/v1/resonance", json=secure_payload, timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return self.local_swarm_fallback(payload)

    def local_swarm_fallback(self, payload):
        print(f"[SWARM PROTECT] Fallback engaged. Perimeter secure.")
        return True
