import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

import { BetChoice, GameState, LeaderboardEntry } from './models/tile.model';
import { GameEngineService } from './services/game-engine.service';
import { LeaderboardApiService } from './services/leaderboard-api.service';

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
export class App implements OnInit {
  private readonly gameEngine = inject(GameEngineService);
  private readonly leaderboardApi = inject(LeaderboardApiService);

  playerName = 'Player';
  leaderboard: LeaderboardEntry[] = [];
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

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  startGame(): void {
    this.savedFinalScore = false;
    this.state = this.gameEngine.createNewGame(this.playerName);
  }

  exitGame(): void {
    this.state = {
      ...this.state,
      page: 'landing',
    };

    this.loadLeaderboard();
  }

  placeBet(bet: BetChoice): void {
    this.state = this.gameEngine.resolveBet(this.state, bet);

    if (this.state.page === 'game-over' && !this.savedFinalScore) {
      this.savedFinalScore = true;

      this.leaderboardApi
        .saveScore(this.state.playerName, this.state.score)
        .subscribe({
          next: (entries) => {
            this.leaderboard = entries;
          },
          error: (error) => {
            console.error('Failed to save score to MongoDB', error);
          },
        });
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

  private loadLeaderboard(): void {
    this.leaderboardApi.getLeaderboard().subscribe({
      next: (entries) => {
        this.leaderboard = entries;
      },
      error: (error) => {
        console.error('Failed to load leaderboard from MongoDB', error);
      },
    });
  }

  private formatTileId(tileId: string): string {
    return tileId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}