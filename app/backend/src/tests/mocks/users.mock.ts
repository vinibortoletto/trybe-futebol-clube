import User from '../../database/models/UserModel'
import ILoginInfo from '../../api/interfaces/ILoginInfo'

const password = "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW"

export const user: User = {
  email: "admin@admin.com",
  id: 1,
  password,
  role: "admin",
  username: "Admin",
} as unknown as User;

export const validLoginInfo: ILoginInfo = {
  email: "admin@admin.com",
  password,
};

export const invalidLoginInfo: ILoginInfo = {
  email: '@invalid.com',
  password,
};