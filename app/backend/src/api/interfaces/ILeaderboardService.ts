import ILeaderboardRow from './ILeaderboardRow';

export default interface ILeaderboardService {
  getHomeLeaderboard(): Promise<ILeaderboardRow[]>;
  getAwayLeaderboard(): Promise<ILeaderboardRow[]>;
}
