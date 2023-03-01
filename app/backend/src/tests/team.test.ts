import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { teamsMock } from './mocks';
import { Model } from 'sequelize';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utils/httpStatusCodes';
import { teamNotFound } from '../utils/errorMessages';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for route /teams', function () {
  afterEach(() => sinon.restore());

  describe('findAll method', () => {
    it('should find all teams', async function () {
      sinon.stub(Model, 'findAll').resolves(teamsMock.teamList);
      const response = await chai.request(app).get('/teams').send();
      expect(response.body).to.deep.equal(teamsMock.teamList);
      expect(response.status).to.equal(OK);
    });

    it('should throw error 500 when trying to find all teams', async function () {
      const errorMessage= 'Internal Server Error'
      sinon.stub(Model, 'findAll').rejects(new Error(errorMessage));
      const response = await chai.request(app).get('/teams').send()
      expect(response.body).to.deep.equal({message: errorMessage});
      expect(response.status).to.equal(INTERNAL_SERVER_ERROR);
    });
  });

  describe('findById method', () => {
    it('should find team by id', async function () {
      sinon.stub(Model, 'findByPk').resolves(teamsMock.team);
      const response = await chai.request(app).get('/teams/1').send();
      expect(response.body).to.deep.equal(teamsMock.team);
      expect(response.status).to.equal(OK);
    });
  });
});
