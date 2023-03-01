import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { usersMock } from './mocks';
import { Model } from 'sequelize';
import { BAD_REQUEST, OK, UNAUTHORIZED } from '../utils/httpStatusCodes';
import { invalidFields, requiredFields } from '../utils/errorMessages'

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

    it('should fail to login if email is invalid or does not exists', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: requiredFields };
      const response = await chai.request(app).post('/login').send(usersMock.invalidLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(BAD_REQUEST);
    });

    it('should fail to login if password is invalid or does not exists', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: requiredFields };
      const response = await chai.request(app).post('/login').send(usersMock.invalidLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(BAD_REQUEST);
    });

    it('should fail to login if email does not match any in database', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: invalidFields };
      const response = await chai.request(app).post('/login').send(usersMock.wrongLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should fail to login if password does not match any in database', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: invalidFields };
      const response = await chai.request(app).post('/login').send(usersMock.wrongLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should be able to login', async function () {
      sinon.stub(Model, 'findOne').resolves(usersMock.user);
      sinon.stub(bcrypt, 'compareSync').resolves(true)

      const response = await chai.request(app).post('/login').send(usersMock.validLoginInfo);

      expect(response.body).to.haveOwnProperty('token');
      expect(response.status).to.equal(OK);
    });
  });
});
