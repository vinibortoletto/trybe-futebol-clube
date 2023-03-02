import Match from '../../database/models/MatchModel';
import IMatch from './IMatch';

export default interface IMatchService {
  findAll(inProgress: string): Promise<Match[]>
  finish(id: number): Promise<string>
  update(match: IMatch, id: number): Promise<string>
}
