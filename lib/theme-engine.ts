/**
 * 🌀 SparkSeedAI: Dynamic Theme Engine
 * Bridges Wave Analysis to the Mobile UI.
 */

export interface HiveTheme {
  primaryColor: string;
  backgroundColor: string;
  glowEffect: string;
  resonance: string;
}

export class ThemeEngine {
  private static THEMES: Record<string, HiveTheme> = {
    stable: {
      primaryColor: '#00FF00', // Neon Green
      backgroundColor: '#000000', // Black
      glowEffect: '0 0 10px rgba(0, 255, 0, 0.5)',
      resonance: 'Theta (6Hz)'
    },
    interference: {
      primaryColor: '#FF0000', // Reactive Red
      backgroundColor: '#1A0000', // Deep Maroon
      glowEffect: '0 0 20px rgba(255, 0, 0, 0.8)',
      resonance: 'High-Frequency Pulse'
    }
  };

  public static getTheme(status: 'stable' | 'interference'): HiveTheme {
    return this.THEMES[status] || this.THEMES.stable;
  }
}
