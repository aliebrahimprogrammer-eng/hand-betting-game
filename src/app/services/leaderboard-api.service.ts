import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { LeaderboardEntry } from '../models/tile.model';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/leaderboard';

  getLeaderboard() {
    return this.http.get<LeaderboardEntry[]>(this.apiUrl);
  }

  saveScore(name: string, score: number) {
    return this.http.post<LeaderboardEntry[]>(this.apiUrl, {
      name,
      score,
    });
  }
}