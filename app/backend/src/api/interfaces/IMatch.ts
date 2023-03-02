import IGoals from './IGoals';

export default interface IMatch extends IGoals {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}
