import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  LeaderboardEntry,
  LeaderboardEntryDocument,
} from './leaderboard-entry.schema';
import { CreateScoreDto } from './create-score.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(LeaderboardEntry.name)
    private readonly leaderboardModel: Model<LeaderboardEntryDocument>
  ) {}

  async findTopFive() {
    const entries = await this.leaderboardModel
      .find()
      .sort({ score: -1, createdAt: 1 })
      .limit(5)
      .lean()
      .exec();

    return entries.map((entry) => ({
      name: entry.name,
      score: entry.score,
      createdAt: entry.createdAt,
    }));
  }

  async createScore(createScoreDto: CreateScoreDto) {
    await this.leaderboardModel.create({
      name: createScoreDto.name?.trim() || 'Player',
      score: Math.max(0, Number(createScoreDto.score) || 0),
    });

    return this.findTopFive();
  }
}