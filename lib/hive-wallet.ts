/**
 * ₿ Hive Wallet: The Sovereign Treasury
 * Uses the HIVE_PRIVATE_KEY to interact with the blockchain.
 */
import { ethers } from "ethers";

export class HiveWallet {
  static getAddress() {
    const privateKey = process.env.HIVE_PRIVATE_KEY;
    if (!privateKey) throw new Error("HIVE_PRIVATE_KEY not found in environment.");
    
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address; // This is your Hive's public receiving address
  }
}

console.log("Hive Treasury Address:", HiveWallet.getAddress());
