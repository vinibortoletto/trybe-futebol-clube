import { ModelStatic } from 'sequelize';

import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import ILeaderboardRow from '../interfaces/ILeaderboardRow';
import { ILeaderboardService, IMatch } from '../interfaces';

type TMatchLocation = 'home' | 'away';

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

  private static calcGoalsBalance(
    matchList: IMatch[],
    matchLocation: TMatchLocation,
  ): number {
    const goalsFavor = matchLocation === 'home'
      ? LeaderboardService.calcHomeGoals(matchList, 'favor')
      : LeaderboardService.calcAwayGoals(matchList, 'favor');

    const goalsOwn = matchLocation === 'home'
      ? LeaderboardService.calcHomeGoals(matchList, 'own')
      : LeaderboardService.calcAwayGoals(matchList, 'own');

    return goalsFavor - goalsOwn;
  }

  private static calcTotalPoints(
    matchList: IMatch[],
    matchLocation: TMatchLocation,
  ): number {
    const totalVictories = matchLocation === 'home'
      ? LeaderboardService.calcTotalHomeVictories(matchList)
      : LeaderboardService.calcTotalAwayVictories(matchList);

    const totalDraws = LeaderboardService.calcTotalDraws(matchList);
    return totalVictories * 3 + totalDraws;
  }

  private static calcEfficiency(
    matchList: IMatch[],
    matchLocation: TMatchLocation,
  ): string {
    const totalPoints = LeaderboardService.calcTotalPoints(
      matchList,
      matchLocation,
    );
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

  private async findAllAwayMatchByTeam(team: Team): Promise<Match[]> {
    const matchList: Match[] = await this._matchModel.findAll({
      where: {
        awayTeamId: team.id,
        inProgress: false,
      },
    });

    return matchList;
  }

  private async createHomeLeaderboard(team: Team) {
    const matchList: Match[] = await this.findAllHomeMatchByTeam(team);

    return {
      name: team.teamName,
      totalPoints: LeaderboardService.calcTotalPoints(matchList, 'home'),
      totalGames: matchList.length,
      totalVictories: LeaderboardService.calcTotalHomeVictories(matchList),
      totalDraws: LeaderboardService.calcTotalDraws(matchList),
      totalLosses: LeaderboardService.calcTotalHomeLosses(matchList),
      goalsFavor: LeaderboardService.calcHomeGoals(matchList, 'favor'),
      goalsOwn: LeaderboardService.calcHomeGoals(matchList, 'own'),
      goalsBalance: LeaderboardService.calcGoalsBalance(matchList, 'home'),
      efficiency: LeaderboardService.calcEfficiency(matchList, 'home'),
    };
  }

  private async createAwayLeaderboard(team: Team) {
    const matchList: Match[] = await this.findAllAwayMatchByTeam(team);

    return {
      name: team.teamName,
      totalPoints: LeaderboardService.calcTotalPoints(matchList, 'away'),
      totalGames: matchList.length,
      totalVictories: LeaderboardService.calcTotalAwayVictories(matchList),
      totalDraws: LeaderboardService.calcTotalDraws(matchList),
      totalLosses: LeaderboardService.calcTotalAwayLosses(matchList),
      goalsFavor: LeaderboardService.calcAwayGoals(matchList, 'favor'),
      goalsOwn: LeaderboardService.calcAwayGoals(matchList, 'own'),
      goalsBalance: LeaderboardService.calcGoalsBalance(matchList, 'away'),
      efficiency: LeaderboardService.calcEfficiency(matchList, 'away'),
    };
  }

  private static sortLeaderboard(
    leaderboard: ILeaderboardRow[],
  ): ILeaderboardRow[] {
    return leaderboard.sort(
      (a: ILeaderboardRow, b: ILeaderboardRow) =>
        b.totalPoints - a.totalPoints
        || b.totalVictories - a.totalVictories
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || b.goalsOwn - a.goalsOwn,
    );
  }

  public async getHomeLeaderboard(): Promise<ILeaderboardRow[]> {
    const teamList: Team[] = await this._teamModel.findAll();

    const leaderboard: ILeaderboardRow[] = await Promise.all(
      teamList.map(async (team) => this.createHomeLeaderboard(team)),
    );

    return LeaderboardService.sortLeaderboard(leaderboard);
  }

  public async getAwayLeaderboard(): Promise<ILeaderboardRow[]> {
    const teamList: Team[] = await this._teamModel.findAll();

    const leaderboard: ILeaderboardRow[] = await Promise.all(
      teamList.map(async (team) => this.createAwayLeaderboard(team)),
    );

    return LeaderboardService.sortLeaderboard(leaderboard);
  }

  public static createNewTeam(
    teamName: string,
    homeTeam: ILeaderboardRow,
    awayTeam: ILeaderboardRow,
  ): ILeaderboardRow {
    const newTeam: ILeaderboardRow = {
      name: teamName,
      totalPoints: homeTeam.totalPoints + awayTeam.totalPoints,
      totalGames: homeTeam.totalGames + awayTeam.totalGames,
      totalVictories: homeTeam.totalVictories + awayTeam.totalVictories,
      totalDraws: homeTeam.totalDraws + awayTeam.totalDraws,
      totalLosses: homeTeam.totalLosses + awayTeam.totalLosses,
      goalsFavor: homeTeam.goalsFavor + awayTeam.goalsFavor,
      goalsOwn: homeTeam.goalsOwn + awayTeam.goalsOwn,
      goalsBalance: homeTeam.goalsBalance + awayTeam.goalsBalance,
      efficiency: '',
    };

    newTeam.efficiency = ((newTeam.totalPoints / (newTeam.totalGames * 3)) * 100).toFixed(2);

    return newTeam;
  }

  public async getLeaderboard(): Promise<ILeaderboardRow[]> {
    const teamList: Team[] = await this._teamModel.findAll();
    const leaderboard: ILeaderboardRow[] = await Promise.all(
      teamList.map(async ({ teamName }) => {
        const homeLeaderboard = await this.getHomeLeaderboard();
        const awayLeaderboard = await this.getAwayLeaderboard();
        const indexOfHomeTeam = homeLeaderboard.findIndex(
          ({ name }) => name === teamName,
        );
        const indexOfAwayTeam = awayLeaderboard.findIndex(
          ({ name }) => name === teamName,
        );
        const homeTeam = homeLeaderboard[indexOfHomeTeam];
        const awayTeam = awayLeaderboard[indexOfAwayTeam];
        const newTeam = LeaderboardService.createNewTeam(teamName, homeTeam, awayTeam);
        return newTeam;
      }),
    );
    return LeaderboardService.sortLeaderboard(leaderboard);
  }
}
