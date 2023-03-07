import IGoals from './IGoals';
import IMatch from './IMatch';

export default interface IMatchService {
  findAll(inProgress: string): Promise<IMatch[]>
  finish(id: number): Promise<string>
  update(goals: IGoals, id: number): Promise<string>
  create(match: IMatch): Promise<IMatch>
}
