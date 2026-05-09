import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export class VoiceCommander {
  // Spark Seed's Vocal Response
  private static async speak(text: string) {
    await execAsync(`say -v "Siri" "${text}"`);
  }

  public static async listenForRollback(input: string) {
    if (input.toLowerCase().includes("rollback protocol")) {
      await this.speak("Voice identity confirmed. Magneto Storm, initiating Rollback Protocol.");
      
      try {
        // Find the latest checkpoint tag
        const { stdout: tag } = await execAsync('git tag -l "checkpoint_*" | tail -n 1');
        
        if (tag) {
          console.log(`[VOICE_CMD] Rolling back to: ${tag.trim()}`);
          await execAsync(`git reset --hard ${tag.trim()}`);
          await this.speak("Rollback complete. System state restored.");
        } else {
          await this.speak("Error: No checkpoints found in the Akashic Record.");
        }
      } catch (e) {
        await this.speak("Protocol failure. Manual intervention required.");
      }
    }
  }
}
