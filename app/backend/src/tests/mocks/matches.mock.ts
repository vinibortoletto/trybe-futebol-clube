import { IMatch } from '../../api/interfaces';
import Match from '../../database/models/MatchModel';

export const matchList = [
  {
    id: 1,
    home_team_id: 16,
    home_team_goals: 1,
    away_team_id: 8,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 2,
    home_team_id: 9,
    home_team_goals: 1,
    away_team_id: 14,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 3,
    home_team_id: 4,
    home_team_goals: 3,
    away_team_id: 11,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 4,
    home_team_id: 3,
    home_team_goals: 0,
    away_team_id: 2,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 5,
    home_team_id: 7,
    home_team_goals: 1,
    away_team_id: 10,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 6,
    home_team_id: 5,
    home_team_goals: 1,
    away_team_id: 13,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 7,
    home_team_id: 12,
    home_team_goals: 2,
    away_team_id: 6,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 8,
    home_team_id: 15,
    home_team_goals: 0,
    away_team_id: 1,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 9,
    home_team_id: 1,
    home_team_goals: 0,
    away_team_id: 12,
    away_team_goals: 3,
    in_progress: 0,
  },
  {
    id: 10,
    home_team_id: 2,
    home_team_goals: 0,
    away_team_id: 9,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 11,
    home_team_id: 13,
    home_team_goals: 1,
    away_team_id: 3,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 12,
    home_team_id: 6,
    home_team_goals: 0,
    away_team_id: 4,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 13,
    home_team_id: 8,
    home_team_goals: 2,
    away_team_id: 5,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 14,
    home_team_id: 14,
    home_team_goals: 2,
    away_team_id: 16,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 15,
    home_team_id: 10,
    home_team_goals: 0,
    away_team_id: 15,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 16,
    home_team_id: 11,
    home_team_goals: 0,
    away_team_id: 7,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 17,
    home_team_id: 1,
    home_team_goals: 2,
    away_team_id: 8,
    away_team_goals: 3,
    in_progress: 0,
  },
  {
    id: 18,
    home_team_id: 12,
    home_team_goals: 4,
    away_team_id: 5,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 19,
    home_team_id: 11,
    home_team_goals: 2,
    away_team_id: 2,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 20,
    home_team_id: 7,
    home_team_goals: 0,
    away_team_id: 9,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 21,
    home_team_id: 6,
    home_team_goals: 3,
    away_team_id: 13,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 22,
    home_team_id: 4,
    home_team_goals: 3,
    away_team_id: 3,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 23,
    home_team_id: 15,
    home_team_goals: 2,
    away_team_id: 16,
    away_team_goals: 3,
    in_progress: 0,
  },
  {
    id: 24,
    home_team_id: 10,
    home_team_goals: 2,
    away_team_id: 14,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 25,
    home_team_id: 2,
    home_team_goals: 0,
    away_team_id: 6,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 26,
    home_team_id: 13,
    home_team_goals: 1,
    away_team_id: 1,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 27,
    home_team_id: 5,
    home_team_goals: 1,
    away_team_id: 15,
    away_team_goals: 2,
    in_progress: 0,
  },
  {
    id: 28,
    home_team_id: 16,
    home_team_goals: 3,
    away_team_id: 7,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 29,
    home_team_id: 9,
    home_team_goals: 0,
    away_team_id: 4,
    away_team_goals: 4,
    in_progress: 0,
  },
  {
    id: 30,
    home_team_id: 3,
    home_team_goals: 0,
    away_team_id: 12,
    away_team_goals: 4,
    in_progress: 0,
  },
  {
    id: 31,
    home_team_id: 8,
    home_team_goals: 2,
    away_team_id: 10,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 32,
    home_team_id: 14,
    home_team_goals: 5,
    away_team_id: 11,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 33,
    home_team_id: 1,
    home_team_goals: 1,
    away_team_id: 16,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 34,
    home_team_id: 9,
    home_team_goals: 3,
    away_team_id: 6,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 35,
    home_team_id: 10,
    home_team_goals: 1,
    away_team_id: 5,
    away_team_goals: 3,
    in_progress: 0,
  },
  {
    id: 36,
    home_team_id: 2,
    home_team_goals: 0,
    away_team_id: 7,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 37,
    home_team_id: 15,
    home_team_goals: 0,
    away_team_id: 13,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 38,
    home_team_id: 14,
    home_team_goals: 2,
    away_team_id: 4,
    away_team_goals: 1,
    in_progress: 0,
  },
  {
    id: 39,
    home_team_id: 3,
    home_team_goals: 2,
    away_team_id: 11,
    away_team_goals: 0,
    in_progress: 0,
  },
  {
    id: 40,
    home_team_id: 12,
    home_team_goals: 4,
    away_team_id: 8,
    away_team_goals: 1,
    in_progress: 0,
  },
] as unknown as Match[];

export const score: IMatch = {
  homeTeamGoals: 3,
  awayTeamGoals: 1,
};
