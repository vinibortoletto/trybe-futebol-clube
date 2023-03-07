import User from '../../database/models/UserModel';
import TLoginInfo from './ILoginInfo';

export default interface IUserService {
  login(loginInfo: TLoginInfo): Promise<string>
  getRole(userInfo: User): Promise<string | undefined>
}
