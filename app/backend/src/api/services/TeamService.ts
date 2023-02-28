import { ModelStatic } from 'sequelize';
import Team from '../../database/models/TeamModel';
import ITeamService from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  private _model: ModelStatic<Team> = Team;

  async findAll(): Promise<Team[]> {
    const teamList = await this._model.findAll();
    return teamList;
  }
}
