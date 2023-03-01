import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import IUserService from '../interfaces/IUserService';
import ILoginInfo from '../interfaces/ILoginInfo';
import User from '../../database/models/UserModel';
import { Unauthorized } from '../errors';
import { invalidFields } from '../../utils/errorMessages';
import TokenHandler from '../../utils/TokenHandler';

export default class UserService implements IUserService {
  private _model: ModelStatic<User> = User;

  async login(loginInfo: ILoginInfo): Promise<string> {
    const { email, password } = loginInfo;

    const user = await this._model.findOne({ where: { email } });
    if (!user) throw new Unauthorized(invalidFields);

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new Unauthorized(invalidFields);

    const token = TokenHandler.generate(loginInfo);
    return token;
  }

  public async getRole(userInfo: User): Promise<string | void> {
    const user = await this._model.findOne({ where: { email: userInfo.email } });
    return user?.role;
  }
}
