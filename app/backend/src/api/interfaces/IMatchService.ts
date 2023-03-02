import Match from '../../database/models/MatchModel';

export default interface IMatchService {
  findAll(inProgress: string): Promise<Match[]>
  finish(id: number): Promise<string>
}
