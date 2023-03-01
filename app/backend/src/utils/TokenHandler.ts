import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';
import { Unauthorized } from '../api/errors';
import { ILoginInfo } from '../api/interfaces';
import { invalidToken } from './errorMessages';

const secret = process.env.JWT_SECRET as Secret;

export default class TokenHandler {
  public static generate(loginInfo: ILoginInfo): string {
    const token = sign(loginInfo, secret);
    return token;
  }

  public static decode(token: string): string | JwtPayload {
    try {
      const decodedUserInfo = verify(token, secret);
      return decodedUserInfo;
    } catch (_e) {
      throw new Unauthorized(invalidToken);
    }
  }
}
