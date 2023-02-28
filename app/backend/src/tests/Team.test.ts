import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { teamsMock } from './mocks';
import { Model } from 'sequelize';
import { OK } from '../utils/httpStatusCodes';

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
  });
});
