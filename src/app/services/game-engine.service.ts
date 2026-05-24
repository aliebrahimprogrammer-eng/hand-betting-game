import { Injectable } from '@angular/core';
import { BetChoice, GameState, Hand, LeaderboardEntry } from '../models/tile.model';
import { createDeck, createInitialHonorValues, shuffle } from './tile-factory';

const HAND_SIZE = 5;
const MAX_HISTORY_ITEMS = 10;
const LEADERBOARD_KEY = 'hand-betting-game-leaderboard';

@Injectable({
  providedIn: 'root',
})
export class GameEngineService {
  createNewGame(playerName: string): GameState {
    const honorValues = createInitialHonorValues();
    const drawPile = createDeck(honorValues);
    const firstHandResult = this.drawHand(1, drawPile, honorValues);

    return {
      page: 'game',
      playerName: playerName.trim() || 'Player',
      score: 0,
      currentHand: firstHandResult.hand,
      history: [],
      drawPile: firstHandResult.remainingDrawPile,
      discardPile: [],
      honorValues,
      reshuffleCount: 0,
      gameOverReason: null,
    };
  }

  resolveBet(state: GameState, bet: BetChoice): GameState {
    if (!state.currentHand || state.page !== 'game') {
      return state;
    }

    let drawPile = [...state.drawPile];
    let discardPile = [...state.discardPile, ...state.currentHand.tiles];
    let reshuffleCount = state.reshuffleCount;

    if (drawPile.length < HAND_SIZE) {
      reshuffleCount++;

      if (reshuffleCount >= 3) {
        return {
          ...state,
          page: 'game-over',
          reshuffleCount,
          discardPile,
          gameOverReason: 'Game over: the draw pile ran out for the 3rd time.',
        };
      }

      drawPile = shuffle([...discardPile, ...createDeck(state.honorValues)]);
      discardPile = [];
    }

    const nextHandResult = this.drawHand(
      state.currentHand.id + 1,
      drawPile,
      state.honorValues
    );

    const nextHand = nextHandResult.hand;

    const won =
      bet === 'higher'
        ? nextHand.total > state.currentHand.total
        : nextHand.total < state.currentHand.total;

    const resolvedHand: Hand = {
      ...nextHand,
      bet,
      outcome: won ? 'win' : 'loss',
    };

    const nextHonorValues = this.updateHonorValues(
      state.honorValues,
      resolvedHand,
      won ? 1 : -1
    );

    const gameOverTile = Object.entries(nextHonorValues).find(
      ([, value]) => value <= 0 || value >= 10
    );

    const nextScore = won
      ? state.score + resolvedHand.total
      : Math.max(0, state.score - resolvedHand.total);

    const nextState: GameState = {
      ...state,
      score: nextScore,
      currentHand: resolvedHand,
      history: [resolvedHand, ...state.history].slice(0, MAX_HISTORY_ITEMS),
      drawPile: nextHandResult.remainingDrawPile,
      discardPile,
      honorValues: nextHonorValues,
      reshuffleCount,
    };

    if (gameOverTile) {
      return {
        ...nextState,
        page: 'game-over',
        gameOverReason: `Game over: ${this.formatTileId(gameOverTile[0])} reached value ${gameOverTile[1]}.`,
      };
    }

    return nextState;
  }

  getLeaderboard(): LeaderboardEntry[] {
    const raw = localStorage.getItem(LEADERBOARD_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as LeaderboardEntry[];
    } catch {
      return [];
    }
  }

  saveScore(name: string, score: number): LeaderboardEntry[] {
    const nextLeaderboard = [
      ...this.getLeaderboard(),
      {
        name: name.trim() || 'Player',
        score,
        createdAt: new Date().toISOString(),
      },
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(nextLeaderboard));

    return nextLeaderboard;
  }

  private drawHand(
    handId: number,
    drawPile: GameState['drawPile'],
    honorValues: GameState['honorValues']
  ): { hand: Hand; remainingDrawPile: GameState['drawPile'] } {
    const tiles = drawPile.slice(0, HAND_SIZE).map((tile) => ({
      ...tile,
      value: tile.type === 'number' ? tile.baseValue : honorValues[tile.id],
    }));

    return {
      hand: {
        id: handId,
        tiles,
        total: tiles.reduce((sum, tile) => sum + tile.value, 0),
      },
      remainingDrawPile: drawPile.slice(HAND_SIZE),
    };
  }

  private updateHonorValues(
    honorValues: Record<string, number>,
    hand: Hand,
    change: number
  ): Record<string, number> {
    const nextValues = { ...honorValues };

    for (const tile of hand.tiles) {
      if (tile.type === 'honor') {
        nextValues[tile.id] = (nextValues[tile.id] ?? 5) + change;
      }
    }

    return nextValues;
  }

  private formatTileId(tileId: string): string {
    return tileId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}