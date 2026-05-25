import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  LeaderboardEntry,
  LeaderboardEntrySchema,
} from './leaderboard-entry.schema';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LeaderboardEntry.name,
        schema: LeaderboardEntrySchema,
      },
    ]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule {}