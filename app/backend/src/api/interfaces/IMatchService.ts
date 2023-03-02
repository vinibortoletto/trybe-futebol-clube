import Match from '../../database/models/MatchModel';
import IGoals from './IGoals';
import IMatch from './IMatch';

export default interface IMatchService {
  findAll(inProgress: string): Promise<Match[]>
  finish(id: number): Promise<string>
  update(goals: IGoals, id: number): Promise<string>
  create(match: IMatch): Promise<Match>
}
