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
  password: 'password',
};

export const loginInfoWithoutEmail: ILoginInfo = {
  email: '',
  password: '123456',
};

export const loginInfoWithoutPassword: ILoginInfo = {
  email: 'admin@admin.com',
  password: '',
};

export const loginInfoWithInvalidEmail: ILoginInfo = {
  email: '@invalid.com',
  password: '123456',
};

export const loginInfoWithInvalidPassword: ILoginInfo = {
  email: 'admin@admin.com',
  password: '123',
};

export const wrongLoginInfo: ILoginInfo = {
  email: 'wrong@email.com',
  password
}

export const validToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjc3Njc5ODkyLCJleHAiOjE2NzgyODQ2OTJ9.PsJkvKnCH_-MAuFZ5QAWuRNr_2uuR4y9jZ3Z9mhDTls';

export const invalidToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjU0NTI3MTg5fQ.XS_9AA82iNoiVaASi0NtJpqOQ_gHSHhxrpIdigiT-fc'