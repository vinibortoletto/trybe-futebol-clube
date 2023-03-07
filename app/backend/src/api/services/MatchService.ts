import { ModelStatic } from 'sequelize';
import { invalidTeam, sameTeams } from '../../utils/errorMessages';
import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import { IGoals, IMatch, IMatchService, ITeam } from '../interfaces';
import { UnprocessableContent, NotFound } from '../errors';

export default class MatchService implements IMatchService {
  private _model: ModelStatic<Match> = Match;
  private static _teamModel: ModelStatic<Team> = Team;

  public async findAll(inProgress: string): Promise<IMatch[]> {
    const condition = inProgress ? { inProgress: JSON.parse(inProgress) } : {};

    const matchList: IMatch[] = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: condition,
    });

    return matchList;
  }

  public async finish(id: number): Promise<string> {
    await this._model.update({ inProgress: false }, { where: { id } });
    return 'Finished';
  }

  public async update(goals: IGoals, id: number): Promise<string> {
    await this._model.update(
      {
        homeTeamGoals: goals.homeTeamGoals,
        awayTeamGoals: goals.awayTeamGoals,
      },
      { where: { id } },
    );

    return 'Updated';
  }

  private static validateIfTeamsAreTheSame({
    homeTeamId,
    awayTeamId,
  }: IMatch): void {
    const areTeamsTheSame: boolean = homeTeamId === awayTeamId;
    if (areTeamsTheSame) throw new UnprocessableContent(sameTeams);
  }

  private static async validateIfTeamsExist({
    homeTeamId,
    awayTeamId,
  }: IMatch): Promise<void> {
    const promises: Promise<ITeam | null>[] = [homeTeamId, awayTeamId]
      .map(async (id) => this._teamModel.findByPk(id));

    const teamList: (ITeam | null)[] = await Promise.all(promises);

    if (teamList.some((team) => !team)) {
      throw new NotFound(invalidTeam);
    }
  }

  public async create(newMatch: IMatch): Promise<IMatch> {
    MatchService.validateIfTeamsAreTheSame(newMatch);
    await MatchService.validateIfTeamsExist(newMatch);

    const match: IMatch = await this._model.create(
      { ...newMatch, inProgress: true },
    );

    return match;
  }
}
