import TLoginInfo from './ILoginInfo';

export default interface IUserService {
  login(loginInfo: TLoginInfo): Promise<string>
}
