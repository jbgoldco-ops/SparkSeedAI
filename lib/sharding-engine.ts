import crypto from 'crypto';

export class ShardingEngine {
  private static ALGORITHM = 'aes-256-cbc';

  /**
   * Shards a data buffer into N encrypted pieces.
   */
  static shardData(data: string, nodeCount: number): string[] {
    const key = process.env.HIVE_PRIVATE_KEY?.slice(0, 32) || 'default_secret_key_32_chars_long';
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(this.ALGORITHM, Buffer.from(key), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Split the encrypted string into shards for the mesh
    const shardSize = Math.ceil(encrypted.length / nodeCount);
    const shards = [];
    for (let i = 0; i < encrypted.length; i += shardSize) {
      shards.push(encrypted.slice(i, i + shardSize));
    }
    
    console.log(`[SHARD_ENGINE] Data split into ${shards.length} fragments for the mesh.`);
    return shards;
  }
}
