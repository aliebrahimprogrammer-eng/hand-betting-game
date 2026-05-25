import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeaderboardEntryDocument = HydratedDocument<LeaderboardEntry>;

@Schema({
  timestamps: true,
})
export class LeaderboardEntry {
  @Prop({
    required: true,
    trim: true,
    maxlength: 40,
  })
  name!: string;

  @Prop({
    required: true,
    min: 0,
  })
  score!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const LeaderboardEntrySchema =
  SchemaFactory.createForClass(LeaderboardEntry);

LeaderboardEntrySchema.index({ score: -1, createdAt: 1 });