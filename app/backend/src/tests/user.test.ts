import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { usersMock } from './mocks';
import { Model } from 'sequelize';
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from '../utils/httpStatusCodes';
import {
  invalidFields,
  invalidToken,
  requiredFields,
  tokenNotFound,
} from '../utils/errorMessages';
import * as jwt from 'jsonwebtoken'

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for route /login and /users', function () {
  afterEach(() => sinon.restore());

  describe('login method', function () {
    it('should fail to login if no email is received', async function () {
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.loginInfoWithoutEmail);

        expect(response.body).to.deep.equal({message: requiredFields});
        expect(response.status).to.equal(BAD_REQUEST);
    });

    it('should fail to login if no password received', async function () {
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.loginInfoWithoutPassword);

      expect(response.body).to.deep.equal({message: requiredFields});
      expect(response.status).to.equal(BAD_REQUEST);
    });

    it('should fail to login if email is invalid', async function () {
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.loginInfoWithInvalidEmail);

      expect(response.body).to.deep.equal({message: invalidFields});
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should fail to login if password is invalid', async function () {
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.loginInfoWithInvalidPassword);

      expect(response.body).to.deep.equal({message: invalidFields});
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should fail to login if email does not match any in database', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: invalidFields };
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.wrongLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should fail to login if password does not match any in database', async function () {
      sinon.stub(Model, 'findOne').resolves(null);

      const errorMessage = { message: invalidFields };
      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.wrongLoginInfo);

      expect(response.body).to.deep.equal(errorMessage);
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should be able to login', async function () {
      sinon.stub(Model, 'findOne').resolves(usersMock.user);
      sinon.stub(bcrypt, 'compareSync').resolves(true);

      const response = await chai
        .request(app)
        .post('/login')
        .send(usersMock.validLoginInfo);

      expect(response.body).to.haveOwnProperty('token');
      expect(response.status).to.equal(OK);
    });
  });

  describe('getRole method', function () {
    it('should fail to get role if token does not exists', async function () {
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', '');
      expect(response.body).to.deep.equal({ message: tokenNotFound });
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should fail to get role if token is invalid', async function () {
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', usersMock.invalidToken);

      expect(response.body).to.deep.equal({ message: invalidToken });
      expect(response.status).to.equal(UNAUTHORIZED);
    });

    it('should be able to get role', async function () {
      sinon.stub(Model, 'findOne').resolves(usersMock.user)
      sinon.stub(jwt, 'verify').resolves(usersMock.user)

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', usersMock.validToken);

      expect(response.body).to.deep.equal({ role: usersMock.user.role });
      expect(response.status).to.equal(OK);
    });
  });
});
