import TTeamType from '../types/TTeamType';
import ILeaderboardRow from './ILeaderboardRow';

export default interface ILeaderboardService {
  getLeaderboard(teamType:TTeamType): Promise<ILeaderboardRow[]>;
}
