import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { Secret, sign } from 'jsonwebtoken';
import IUserService from '../interfaces/IUserService';
import ILoginInfo from '../interfaces/ILoginInfo';
import User from '../../database/models/UserModel';
import { Unauthorized } from '../errors';
import { invalidFields } from '../../utils/errorMessages';

const secret = process.env.JWT_SECRET || undefined as unknown as Secret;

export default class UserService implements IUserService {
  private _model: ModelStatic<User> = User;

  async login(loginInfo: ILoginInfo): Promise<string> {
    const { email, password } = loginInfo;

    const user = await this._model.findOne({ where: { email } });
    if (!user) throw new Unauthorized(invalidFields);

    const isPasswordValid = bcrypt.compareSync(password, user?.password);
    if (!isPasswordValid) throw new Unauthorized(invalidFields);

    const token = sign(loginInfo, secret);
    return token;
  }
}
