import { ModelStatic } from 'sequelize';
import { teamNotFound } from '../../utils/errorMessages';
import Team from '../../database/models/TeamModel';
import NotFound from '../errors/NotFound';
import { ITeam, ITeamService } from '../interfaces';

export default class TeamService implements ITeamService {
  private _model: ModelStatic<Team> = Team;

  async findAll(): Promise<ITeam[]> {
    const teamList: ITeam[] = await this._model.findAll();
    return teamList;
  }

  async findById(id:number): Promise<ITeam> {
    const team: ITeam | null = await this._model.findByPk(id);
    if (!team) throw new NotFound(teamNotFound);
    return team;
  }
}
