import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

import { app } from '../app';
import { Model } from 'sequelize';
import { matchesMock } from './mocks';
import { OK } from '../utils/httpStatusCodes';

describe('Integration tests for route /matches', function () {
  afterEach(() => sinon.restore());

  describe('findAll method', function () {
    it('should find all matches', async function () {
      sinon.stub(Model, 'findAll').resolves(matchesMock.matchList);
      const response = await chai.request(app).get('/matches').send();
      expect(response.body).to.deep.equal(matchesMock.matchList);
      expect(response.status).to.equal(OK);
    });
  });
});
