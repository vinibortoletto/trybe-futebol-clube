import { ModelStatic } from 'sequelize';
import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import ILeaderboardRow from '../interfaces/ILeaderboardRow';
import { ILeaderboardService } from '../interfaces';
import TTeamType from '../types/TTeamType';

export default class LeaderboardService implements ILeaderboardService {
  private _matchModel: ModelStatic<Match> = Match;
  private _teamModel: ModelStatic<Team> = Team;

  private static getTeamMatchList(
    team: Team,
    teamType: TTeamType,
    matchList: Match[],
  ): Match[] {
    return matchList.filter((match: Match) => {
      const { homeTeamId, awayTeamId } = match;
      const teamId = match[`${teamType}TeamId` as keyof Match];

      return (
        teamType === 'both'
        && (homeTeamId === team.id || awayTeamId === team.id)
      )
        || (teamId === team.id);
    });
  }

  private static calcVictoriesAndLosses(
    matchList: Match[],
    teamId: number,
    type: 'victories' | 'losses',
  ): number {
    return matchList.reduce((acc: number, match: Match) => {
      const { homeTeamGoals, awayTeamGoals, homeTeamId } = match;
      const teamGoals = homeTeamId === teamId ? homeTeamGoals : awayTeamGoals;
      const adversaryGoals = homeTeamId !== teamId ? homeTeamGoals : awayTeamGoals;

      return type === 'victories'
        ? acc + (teamGoals > adversaryGoals ? 1 : 0)
        : acc + (teamGoals < adversaryGoals ? 1 : 0);
    }, 0);
  }

  private static calcDraws(matchList: Match[]): number {
    return matchList.filter(
      (match) => match.homeTeamGoals === match.awayTeamGoals,
    ).length;
  }

  private static calcTotalPoints(matchList: Match[], teamId: number):number {
    const { calcVictoriesAndLosses, calcDraws } = LeaderboardService;
    const totalVictories = calcVictoriesAndLosses(matchList, teamId, 'victories');
    const totalDraws = calcDraws(matchList);
    return (totalVictories * 3) + totalDraws;
  }

  private static calcGoals(
    matchList: Match[],
    teamId: number,
    type: 'favor' | 'own',
  ): number {
    return matchList.reduce((acc: number, match: Match) => {
      const { homeTeamId, homeTeamGoals, awayTeamGoals } = match;

      return type === 'favor'
        ? acc + (homeTeamId === teamId ? homeTeamGoals : awayTeamGoals)
        : acc + (homeTeamId === teamId ? awayTeamGoals : homeTeamGoals);
    }, 0);
  }

  private static calcGoalsBalance(matchList: Match[], teamId: number): number {
    const { calcGoals } = LeaderboardService;
    const goalsFavor = calcGoals(matchList, teamId, 'favor');
    const goalsOwn = calcGoals(matchList, teamId, 'own');
    return goalsFavor - goalsOwn;
  }

  private static calcEfficiency(matchList: Match[], teamId: number): string {
    const { calcTotalPoints } = LeaderboardService;
    const totalPoints = calcTotalPoints(matchList, teamId);
    const totalGames = matchList.length;
    const efficiency = (totalPoints / (totalGames * 3)) * 100;
    return efficiency.toFixed(2);
  }

  private static createNewTeam(matchList: Match[], team: Team) {
    const {
      calcVictoriesAndLosses, calcDraws,
      calcTotalPoints, calcGoals,
      calcGoalsBalance, calcEfficiency,
    } = LeaderboardService;

    return {
      name: team.teamName,
      totalPoints: calcTotalPoints(matchList, team.id),
      totalGames: matchList.length,
      totalVictories: calcVictoriesAndLosses(matchList, team.id, 'victories'),
      totalDraws: calcDraws(matchList),
      totalLosses: calcVictoriesAndLosses(matchList, team.id, 'losses'),
      goalsFavor: calcGoals(matchList, team.id, 'favor'),
      goalsOwn: calcGoals(matchList, team.id, 'own'),
      goalsBalance: calcGoalsBalance(matchList, team.id),
      efficiency: calcEfficiency(matchList, team.id),
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

  public async getLeaderboard(
    teamType: TTeamType,
  ): Promise<ILeaderboardRow[]> {
    const {
      sortLeaderboard,
      createNewTeam,
      getTeamMatchList,
    } = LeaderboardService;

    const teamList = await this._teamModel.findAll();
    const matchList = await this._matchModel.findAll({
      where: { inProgress: false },
    });

    const leaderboard = teamList.map((team: Team) => {
      const teamMatchList = getTeamMatchList(team, teamType, matchList);
      return createNewTeam(teamMatchList, team);
    });

    return sortLeaderboard(leaderboard);
  }
}
