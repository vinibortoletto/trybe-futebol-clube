import { ModelStatic } from 'sequelize';

import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import ILeaderboardRow from '../interfaces/ILeaderboardRow';
import { ILeaderboardService, IMatch } from '../interfaces';

export default class LeaderboardService implements ILeaderboardService {
  private _matchModel: ModelStatic<Match> = Match;
  private _teamModel: ModelStatic<Team> = Team;

  private static calcTotalAwayVictories(matchList: IMatch[]): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (awayTeamGoals > homeTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calcTotalHomeVictories(matchList: IMatch[]): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (homeTeamGoals > awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calcTotalAwayLosses(matchList: IMatch[]): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (awayTeamGoals < homeTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calcTotalHomeLosses(matchList: IMatch[]): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (homeTeamGoals < awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calcTotalDraws(matchList: IMatch[]): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (homeTeamGoals === awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static calcAwayGoals(
    matchList: IMatch[],
    type = 'favor' || 'own',
  ): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (type === 'favor' ? acc + awayTeamGoals : acc + homeTeamGoals),
      0,
    );
  }

  private static calcHomeGoals(
    matchList: IMatch[],
    type = 'favor' || 'own',
  ): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (type === 'favor' ? acc + homeTeamGoals : acc + awayTeamGoals),
      0,
    );
  }

  private static calcGoalsBalance(matchList: IMatch[]): number {
    const goalsFavor = LeaderboardService.calcHomeGoals(matchList, 'favor');
    const goalsOwn = LeaderboardService.calcHomeGoals(matchList, 'own');
    return goalsFavor - goalsOwn;
  }

  private static calcTotalPoints(matchList: IMatch[]): number {
    const totalVictories = LeaderboardService.calcTotalHomeVictories(matchList);
    const totalDraws = LeaderboardService.calcTotalDraws(matchList);
    return totalVictories * 3 + totalDraws;
  }

  private static calcEfficiency(matchList: IMatch[]): string {
    const totalPoints = LeaderboardService.calcTotalPoints(matchList);
    const totalGames = matchList.length;
    const totalEfficiency = (totalPoints / (totalGames * 3)) * 100;
    return totalEfficiency.toFixed(2);
  }

  private async findAllHomeMatchByTeam(team: Team): Promise<Match[]> {
    const matchList: Match[] = await this._matchModel.findAll({
      where: {
        homeTeamId: team.id,
        inProgress: false,
      },
    });

    return matchList;
  }

  private async createHomeLeaderboard(team: Team) {
    const matchList: Match[] = await this.findAllHomeMatchByTeam(team);

    return {
      name: team.teamName,
      totalPoints: LeaderboardService.calcTotalPoints(matchList),
      totalGames: matchList.length,
      totalVictories: LeaderboardService.calcTotalHomeVictories(matchList),
      totalDraws: LeaderboardService.calcTotalDraws(matchList),
      totalLosses: LeaderboardService.calcTotalHomeLosses(matchList),
      goalsFavor: LeaderboardService.calcHomeGoals(matchList, 'favor'),
      goalsOwn: LeaderboardService.calcHomeGoals(matchList, 'own'),
      goalsBalance: LeaderboardService.calcGoalsBalance(matchList),
      efficiency: LeaderboardService.calcEfficiency(matchList),
    };
  }

  private static sortLeaderboard(leaderboard: ILeaderboardRow[]): ILeaderboardRow[] {
    return leaderboard.sort((a: ILeaderboardRow, b: ILeaderboardRow) => (
      b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || b.goalsOwn - a.goalsOwn
    ));
  }

  public async getHomeLeaderboard(): Promise<ILeaderboardRow[]> {
    const teamList: Team[] = await this._teamModel.findAll();

    const leaderboard: ILeaderboardRow[] = await Promise.all(
      teamList.map(async (team) => this.createHomeLeaderboard(team)),
    );

    return LeaderboardService.sortLeaderboard(leaderboard);
  }
}
