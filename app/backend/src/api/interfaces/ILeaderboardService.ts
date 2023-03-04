import ILeaderboardRow from './ILeaderboardRow';

export default interface ILeaderboardService {
  findAllHome(): Promise<ILeaderboardRow[]>;
}
