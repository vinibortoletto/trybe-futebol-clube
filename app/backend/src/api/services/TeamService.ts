import { ModelStatic } from 'sequelize';
import { teamNotFound } from '../../utils/errorMessages';
import Team from '../../database/models/TeamModel';
import NotFound from '../errors/NotFound';
import ITeamService from '../interfaces/ITeamService';

export default class TeamService implements ITeamService {
  private _model: ModelStatic<Team> = Team;

  async findAll(): Promise<Team[]> {
    const teamList = await this._model.findAll();
    return teamList;
  }

  async findById(id:number): Promise<Team | null> {
    const team = await this._model.findByPk(id);
    if (!team) throw new NotFound(teamNotFound);
    return team;
  }
}
