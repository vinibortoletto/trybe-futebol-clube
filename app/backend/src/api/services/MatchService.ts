import { ModelStatic } from 'sequelize';
import { invalidTeam, sameTeams } from '../../utils/errorMessages';
import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import { IMatch, IMatchService } from '../interfaces';
import IGoals from '../interfaces/IGoals';
import UnprocessableContent from '../errors/UnprocessableContent';
import NotFound from '../errors/NotFound';

export default class MatchService implements IMatchService {
  private _model: ModelStatic<Match> = Match;
  private static _teamModel: ModelStatic<Team> = Team;

  public async findAll(inProgress: string): Promise<Match[]> {
    const condition = inProgress ? { inProgress: JSON.parse(inProgress) } : {};

    const matchList = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: condition,
    });

    return matchList;
  }

  public async finish(id: number): Promise<string> {
    await this._model.update({ isProgress: false }, { where: { id } });

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
    const areTeamsTheSame = homeTeamId === awayTeamId;
    if (areTeamsTheSame) throw new UnprocessableContent(sameTeams);
  }

  private static async validateIfTeamsExist({
    homeTeamId,
    awayTeamId,
  }: IMatch): Promise<void> {
    const promises = [homeTeamId, awayTeamId].map(async (id) =>
      this._teamModel.findByPk(id));

    const teamList = await Promise.all(promises);

    if (teamList.some((team) => !team)) {
      throw new NotFound(invalidTeam);
    }
  }

  public async create(newMatch: IMatch): Promise<Match> {
    MatchService.validateIfTeamsAreTheSame(newMatch);
    await MatchService.validateIfTeamsExist(newMatch);

    const match = await this._model.create({ ...newMatch, inProgress: true });
    return match;
  }
}
