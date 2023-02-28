import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { usersMock } from './mocks';
import { Model } from 'sequelize';
import { BAD_REQUEST, OK } from '../utils/httpStatusCodes';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for route /login and /users', function () {
  afterEach(() => sinon.restore());

  describe('login method', () => {
    it('should be able to login', async function () {
      sinon.stub(Model, 'findOne').resolves(usersMock.user);

      const body = {
        email: usersMock.user.email,
        password: usersMock.user.password,
      };

      const response = await chai.request(app).post('/login').send(body);

      expect(response.body).to.deep.equal(usersMock.user.password);
      expect(response.status).to.equal(OK);
    });

    it('should fail to login if email is invalid', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: 'All fields must be filled' };
      const response = await chai.request(app).post('/login').send(usersMock.invalidLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(BAD_REQUEST);
    });

  });
});
