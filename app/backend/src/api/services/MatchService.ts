import { ModelStatic } from 'sequelize';
import Match from '../../database/models/MatchModel';
import { IMatchService } from '../interfaces';

export default class MatchService implements IMatchService {
  private _model: ModelStatic<Match> = Match;

  async findAll(): Promise<Match[]> {
    const matchList = await this._model.findAll();
    return matchList;
  }
}
