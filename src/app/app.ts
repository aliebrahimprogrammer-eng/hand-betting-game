import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { BetChoice, GameState, LeaderboardEntry } from './models/tile.model';
import { GameEngineService } from './services/game-engine.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TagModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly gameEngine = inject(GameEngineService);

  playerName = 'Player';
  leaderboard: LeaderboardEntry[] = this.gameEngine.getLeaderboard();
  savedFinalScore = false;

  state: GameState = {
    page: 'landing',
    playerName: 'Player',
    score: 0,
    currentHand: null,
    history: [],
    drawPile: [],
    discardPile: [],
    honorValues: {},
    reshuffleCount: 0,
    gameOverReason: null,
  };

  startGame(): void {
    this.savedFinalScore = false;
    this.state = this.gameEngine.createNewGame(this.playerName);
  }

  exitGame(): void {
    this.state = {
      ...this.state,
      page: 'landing',
    };

    this.leaderboard = this.gameEngine.getLeaderboard();
  }

  placeBet(bet: BetChoice): void {
    this.state = this.gameEngine.resolveBet(this.state, bet);

    if (this.state.page === 'game-over' && !this.savedFinalScore) {
      this.leaderboard = this.gameEngine.saveScore(
        this.state.playerName,
        this.state.score
      );
      this.savedFinalScore = true;
    }
  }

  playAgain(): void {
    this.startGame();
  }

  getHonorRows(): Array<{ id: string; label: string; value: number }> {
    return Object.entries(this.state.honorValues).map(([id, value]) => ({
      id,
      label: this.formatTileId(id),
      value,
    }));
  }

  private formatTileId(tileId: string): string {
    return tileId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}