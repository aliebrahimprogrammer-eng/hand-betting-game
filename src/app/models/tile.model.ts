export type BetChoice = 'higher' | 'lower';
export type GamePage = 'landing' | 'game' | 'game-over';
export type RoundOutcome = 'win' | 'loss';

export interface TileDefinition {
  id: string;
  label: string;
  symbol: string;
  type: 'number' | 'honor';
  baseValue: number;
}

export interface TileInstance extends TileDefinition {
  instanceId: string;
  value: number;
}

export interface Hand {
  id: number;
  tiles: TileInstance[];
  total: number;
  bet?: BetChoice;
  outcome?: RoundOutcome;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  createdAt: string;
}

export interface GameState {
  page: GamePage;
  playerName: string;
  score: number;
  currentHand: Hand | null;
  history: Hand[];
  drawPile: TileInstance[];
  discardPile: TileInstance[];
  honorValues: Record<string, number>;
  reshuffleCount: number;
  gameOverReason: string | null;
}