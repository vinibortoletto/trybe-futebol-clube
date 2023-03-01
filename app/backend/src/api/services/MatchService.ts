import { ModelStatic } from 'sequelize';
import Team from '../../database/models/TeamModel';
import Match from '../../database/models/MatchModel';
import { IMatchService } from '../interfaces';

export default class MatchService implements IMatchService {
  private _model: ModelStatic<Match> = Match;

  async findAll(inProgress = ''): Promise<Match[]> {
    const matchList = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ],
      where: { inProgress: JSON.parse(inProgress) },
    });

    return matchList;
  }
}
