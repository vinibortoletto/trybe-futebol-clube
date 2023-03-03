import { ModelStatic } from 'sequelize';

import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import ILeaderboard from '../interfaces/ILeaderboard';
import { ILeaderboardService, IMatch } from '../interfaces';

export default class LeaderboardService implements ILeaderboardService {
  private _matchModel: ModelStatic<Match> = Match;
  private _teamModel: ModelStatic<Team> = Team;

  private static calcTotalAwayVictories(
    matchList: IMatch[],
  ): number {
    return matchList.reduce((acc, { homeTeamGoals, awayTeamGoals }) =>
      (awayTeamGoals > homeTeamGoals ? acc + 1 : acc), 0);
  }

  private static calcTotalHomeVictories(
    matchList: IMatch[],
  ): number {
    return matchList.reduce((acc, { homeTeamGoals, awayTeamGoals }) =>
      (homeTeamGoals > awayTeamGoals ? acc + 1 : acc), 0);
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
        (type === 'favor'
          ? acc + awayTeamGoals
          : acc + homeTeamGoals),
      0,
    );
  }

  private static calcHomeGoals(
    matchList: IMatch[],
    type = 'favor' || 'own',
  ): number {
    return matchList.reduce(
      (acc, { homeTeamGoals, awayTeamGoals }) =>
        (type === 'favor'
          ? acc + homeTeamGoals
          : acc + awayTeamGoals),
      0,
    );
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
    const totalVictories = LeaderboardService.calcTotalHomeVictories(matchList);
    const totalDraws = LeaderboardService.calcTotalDraws(matchList);

    return {
      name: team.teamName,
      totalPoints: totalVictories * 3 + totalDraws,
      totalGames: matchList.length,
      totalVictories: LeaderboardService.calcTotalHomeVictories(matchList),
      totalDraws: LeaderboardService.calcTotalDraws(matchList),
      totalLosses: LeaderboardService.calcTotalHomeLosses(matchList),
      goalsFavor: LeaderboardService.calcHomeGoals(matchList, 'favor'),
      goalsOwn: LeaderboardService.calcHomeGoals(matchList, 'own'),
    };
  }

  public async findAllHome(): Promise<ILeaderboard[]> {
    const teamList: Team[] = await this._teamModel.findAll();

    return Promise.all(teamList.map(
      async (team) => this.createHomeLeaderboard(team),
    ));
  }
}
