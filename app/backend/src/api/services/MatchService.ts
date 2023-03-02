import { ModelStatic } from 'sequelize';
import { sameTeams } from '../../utils/errorMessages';
import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import { IMatch, IMatchService } from '../interfaces';
import IGoals from '../interfaces/IGoals';
import UnprocessableContent from '../errors/UnprocessableContent';

export default class MatchService implements IMatchService {
  private _model: ModelStatic<Match> = Match;

  public async findAll(inProgress: string): Promise<Match[]> {
    const condition = inProgress
      ? { inProgress: JSON.parse(inProgress) }
      : {};

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
    await this._model.update(
      { isProgress: false },
      { where: { id } },
    );

    return 'Finished';
  }

  public async update(goals: IGoals, id: number): Promise<string> {
    await this._model.update(
      { homeTeamGoals: goals.homeTeamGoals,
        awayTeamGoals: goals.awayTeamGoals,
      },
      { where: { id } },
    );

    return 'Updated';
  }

  private static validateMatch({ homeTeamId, awayTeamId }: IMatch): void {
    const areTeamsTheSame = homeTeamId === awayTeamId;
    if (areTeamsTheSame) throw new UnprocessableContent(sameTeams);
  }

  public async create(newMatch: IMatch): Promise<Match> {
    MatchService.validateMatch(newMatch);

    const match = await this._model.create({ ...newMatch, inProgress: true });
    return match;
  }
}
