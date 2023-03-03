import ILeaderboard from './ILeaderboard';

export default interface ILeaderboardService {
  findAllHome(): Promise<ILeaderboard[]>;
}
