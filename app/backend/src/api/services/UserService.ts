import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { IUser, ILoginInfo, IUserService } from '../interfaces';
import User from '../../database/models/UserModel';
import { Unauthorized } from '../errors';
import { invalidFields } from '../../utils/errorMessages';
import TokenHandler from '../../utils/TokenHandler';

export default class UserService implements IUserService {
  private _model: ModelStatic<User> = User;

  async login(loginInfo: ILoginInfo): Promise<string> {
    const { email, password } = loginInfo;

    const user: IUser | null = await this._model.findOne({ where: { email } });
    if (!user) throw new Unauthorized(invalidFields);

    const isPasswordValid: boolean = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new Unauthorized(invalidFields);

    const token: string = TokenHandler.generate(loginInfo);
    return token;
  }

  public async getRole(userInfo: User): Promise<string | undefined> {
    const user: IUser | null = await this._model.findOne({ where: { email: userInfo.email } });
    return user?.role;
  }
}
