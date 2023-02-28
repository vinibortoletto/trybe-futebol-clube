import { ModelStatic } from 'sequelize';
// import * as bcrypt from 'bcryptjs';
import IUserService from '../interfaces/IUserService';
import ILoginInfo from '../interfaces/ILoginInfo';
import User from '../../database/models/UserModel';

export default class UserService implements IUserService {
  private _model: ModelStatic<User> = User;

  async login(loginInfo: ILoginInfo): Promise<string> {
    const { email, password } = loginInfo;
    const user = await this._model.findOne({ where: { email } });

    // const isPasswordValid = bcrypt.compareSync(password, user?.password);
    console.log(user);

    return password;
  }
}
