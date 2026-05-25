import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateScoreDto } from './create-score.dto';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  findTopFive() {
    return this.leaderboardService.findTopFive();
  }

  @Post()
  createScore(@Body() createScoreDto: CreateScoreDto) {
    return this.leaderboardService.createScore(createScoreDto);
  }
}